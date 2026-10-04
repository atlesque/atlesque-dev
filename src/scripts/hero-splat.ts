/**
 * Renders the hero 3D Gaussian splat (public/models/hero.splat, generated
 * from the hero photo with TripoSplat, see scripts/README-hero-splat.md)
 * with a small WebGL2 splat renderer.
 *
 * - Fine pointers: the figure turns towards the mouse.
 * - Touch: it sways slowly on its own.
 * - Anyone can drag to spin it all the way around.
 * Falls back to the plain photo without WebGL2, without JS or when the user
 * prefers reduced motion (the canvas is simply never shown).
 *
 * Look: the colours stored in the file are only used as a brightness map. The
 * fragment shader turns them into a single-hue red hologram (depth, scanlines
 * and a sweeping scan band add variation), so the style can be tuned here
 * without regenerating the model.
 *
 * File format: the common ".splat" layout, 32 bytes per Gaussian:
 * position f32×3, scale f32×3, colour u8×4 (RGBA), rotation u8×4 (w,x,y,z).
 */

const ROW = 32;
const TEX_WIDTH = 2048; // 4 texels per splat
const MAX_FOLLOW_YAW = 0.7;
const MAX_FOLLOW_PITCH = 0.18;
const TAU = Math.PI * 2;
/** Splat files are usually stored y-down, z-forward (OpenCV); flipping y and z turns them upright. */
const FLIP_Y = true;
/** TripoSplat's output faces +x; turn the camera so the figure faces the viewer. */
const FRONT_YAW = -Math.PI / 2;

const VERT = `#version 300 es
precision highp float;
precision highp int;
uniform highp sampler2D uData;
uniform mat4 uView, uProj;
uniform vec2 uFocal, uViewport;
uniform float uSize, uDist, uHalfDepth, uHeight;
in vec2 aCorner;
in uint aIndex;
out vec4 vColor;
out vec2 vPos;
out float vDepth;
out float vHeight;

vec4 texel(uint i, uint k) {
  uint t = i * 4u + k;
  return texelFetch(uData, ivec2(int(t % ${TEX_WIDTH}u), int(t / ${TEX_WIDTH}u)), 0);
}

void main() {
  vec4 t0 = texel(aIndex, 0u), t1 = texel(aIndex, 1u), t2 = texel(aIndex, 2u), t3 = texel(aIndex, 3u);
  vec4 cam = uView * vec4(t0.xyz, 1.0);
  vec4 clip = uProj * cam;
  float bound = 1.2 * clip.w;
  if (cam.z <= 0.0 || abs(clip.x) > bound || abs(clip.y) > bound) {
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
    return;
  }
  mat3 vrk = mat3(t2.x, t2.y, t2.z, t2.y, t2.w, t3.x, t2.z, t3.x, t3.y);
  mat3 J = mat3(
    uFocal.x / cam.z, 0.0, -(uFocal.x * cam.x) / (cam.z * cam.z),
    0.0, -uFocal.y / cam.z, (uFocal.y * cam.y) / (cam.z * cam.z),
    0.0, 0.0, 0.0);
  mat3 T = transpose(mat3(uView)) * J;
  mat3 cov = transpose(T) * vrk * T;
  cov[0][0] += 0.3;
  cov[1][1] += 0.3;
  float mid = 0.5 * (cov[0][0] + cov[1][1]);
  float radius = length(vec2(0.5 * (cov[0][0] - cov[1][1]), cov[0][1]));
  float l1 = mid + radius, l2 = mid - radius;
  if (l2 < 0.0) {
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
    return;
  }
  vec2 dir = normalize(vec2(cov[0][1], l1 - cov[0][0]));
  vec2 major = min(sqrt(2.0 * l1), 1024.0) * dir * uSize;
  vec2 minor = min(sqrt(2.0 * l2), 1024.0) * vec2(dir.y, -dir.x) * uSize;
  vColor = t1;
  vDepth = clamp((cam.z - uDist) / uHalfDepth * 0.5 + 0.5, 0.0, 1.0);
  vHeight = t0.y / uHeight; // -0.5 (feet) .. 0.5 (head)
  vPos = aCorner;
  vec2 c = clip.xy / clip.w;
  gl_Position = vec4(c + (aCorner.x * major + aCorner.y * minor) / uViewport, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform float uTime;
in vec4 vColor;
in vec2 vPos;
in float vDepth;
in float vHeight;
out vec4 fragColor;

// Brand red (#F3665B) ramp: deep shadow red -> brand red -> hot highlight
const vec3 SHADOW = vec3(0.30, 0.03, 0.04);
const vec3 BRAND = vec3(0.953, 0.400, 0.357);
const vec3 HOT = vec3(1.0, 0.58, 0.52);

void main() {
  float a = -dot(vPos, vPos);
  if (a < -4.0) discard;
  float lum = dot(vColor.rgb, vec3(0.299, 0.587, 0.114));
  lum = smoothstep(0.0, 0.55, lum);
  vec3 col = lum < 0.6 ? mix(SHADOW, BRAND, lum / 0.6) : mix(BRAND, HOT, (lum - 0.6) / 0.4);
  // depth: near surfaces glow, far ones recede into the dark
  float depth = mix(1.15, 0.35, vDepth);
  // fine horizontal scanlines drifting upwards
  float scan = 0.78 + 0.22 * sin(vHeight * 90.0 - uTime * 2.2);
  // a bright band sweeping up the figure every few seconds
  float sweep = fract(uTime * 0.14);
  float band = exp(-pow((vHeight + 0.5 - sweep * 1.5 + 0.25) * 9.0, 2.0));
  float power = (0.55 + 1.6 * lum) * depth * scan + band * 1.4;
  float b = exp(a) * vColor.a * 0.7;
  fragColor = vec4(col * power * b, 1.0);
}`;

interface Splats {
  count: number;
  data: Float32Array; // 16 floats per splat, laid out as 4 RGBA texels
  centers: Float32Array;
  height: number;
}

/** Parses the file, recentres it and precomputes each 3D covariance. */
function parseSplats(buf: ArrayBuffer): Splats {
  const count = Math.floor(buf.byteLength / ROW);
  const f = new Float32Array(buf, 0, (count * ROW) / 4);
  const u = new Uint8Array(buf);
  const ys = new Float32Array(count);
  const xs = new Float32Array(count);
  const zs = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    xs[i] = f[i * 8];
    ys[i] = f[i * 8 + 1] * (FLIP_Y ? -1 : 1);
    zs[i] = f[i * 8 + 2] * (FLIP_Y ? -1 : 1);
  }
  // Robust bounds (ignore the 1% outliers floaters tend to be)
  const pct = (a: Float32Array, p: number) => {
    const s = Float32Array.from(a).sort();
    return s[Math.min(s.length - 1, Math.floor(p * s.length))];
  };
  const cx = (pct(xs, 0.01) + pct(xs, 0.99)) / 2;
  const cy = (pct(ys, 0.01) + pct(ys, 0.99)) / 2;
  const cz = (pct(zs, 0.01) + pct(zs, 0.99)) / 2;
  const height = pct(ys, 0.99) - pct(ys, 0.01);

  const data = new Float32Array(Math.ceil((count * 4) / TEX_WIDTH) * TEX_WIDTH * 4);
  const centers = new Float32Array(count * 3);
  const flip = FLIP_Y ? -1 : 1;
  for (let i = 0; i < count; i++) {
    const o = i * 16;
    const x = xs[i] - cx, y = ys[i] - cy, z = zs[i] - cz;
    centers.set([x, y, z], i * 3);
    data[o] = x;
    data[o + 1] = y;
    data[o + 2] = z;
    for (let k = 0; k < 4; k++) data[o + 4 + k] = u[i * ROW + 24 + k] / 255;

    const sx = f[i * 8 + 3], sy = f[i * 8 + 4], sz = f[i * 8 + 5];
    let qw = (u[i * ROW + 28] - 128) / 128;
    let qx = (u[i * ROW + 29] - 128) / 128;
    let qy = (u[i * ROW + 30] - 128) / 128;
    let qz = (u[i * ROW + 31] - 128) / 128;
    const qn = Math.hypot(qw, qx, qy, qz) || 1;
    qw /= qn; qx /= qn; qy /= qn; qz /= qn;
    // M = S * R, sigma = M^T M
    const m = [
      sx * (1 - 2 * (qy * qy + qz * qz)), sx * 2 * (qx * qy + qw * qz), sx * 2 * (qx * qz - qw * qy),
      sy * 2 * (qx * qy - qw * qz), sy * (1 - 2 * (qx * qx + qz * qz)), sy * 2 * (qy * qz + qw * qx),
      sz * 2 * (qx * qz + qw * qy), sz * 2 * (qy * qz - qw * qx), sz * (1 - 2 * (qx * qx + qy * qy)),
    ];
    const s00 = m[0] * m[0] + m[3] * m[3] + m[6] * m[6];
    const s01 = m[0] * m[1] + m[3] * m[4] + m[6] * m[7];
    const s02 = m[0] * m[2] + m[3] * m[5] + m[6] * m[8];
    const s11 = m[1] * m[1] + m[4] * m[4] + m[7] * m[7];
    const s12 = m[1] * m[2] + m[4] * m[5] + m[7] * m[8];
    const s22 = m[2] * m[2] + m[5] * m[5] + m[8] * m[8];
    // Flipping y and z negates the covariance terms that mix x with y or z
    data[o + 8] = s00;
    data[o + 9] = s01 * flip;
    data[o + 10] = s02 * flip;
    data[o + 11] = s11;
    data[o + 12] = s12;
    data[o + 13] = s22;
  }
  return { count, data, centers, height };
}

/** Column-major view matrix for a camera orbiting the origin; camera looks down +z, y up. */
function orbitView(yaw: number, pitch: number, dist: number): Float32Array {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  // rows of R = Rx(pitch) * Ry(yaw)
  const r = [
    [cy, 0, sy],
    [sp * sy, cp, -sp * cy],
    [-cp * sy, sp, cp * cy],
  ];
  // camera space: x right, y up, z forward (away from the viewer) => negate z row
  return new Float32Array([
    r[0][0], r[1][0], -r[2][0], 0,
    r[0][1], r[1][1], -r[2][1], 0,
    r[0][2], r[1][2], -r[2][2], 0,
    0, 0, dist, 1,
  ]);
}

function projection(fx: number, fy: number, w: number, h: number): Float32Array {
  const near = 0.05, far = 50;
  return new Float32Array([
    (2 * fx) / w, 0, 0, 0,
    0, (2 * fy) / h, 0, 0,
    0, 0, far / (far - near), 1,
    0, 0, -(far * near) / (far - near), 0,
  ]);
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(shader));
  return shader;
}

export async function initHeroSplat(container: HTMLElement, canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: true });
  if (!gl) return;

  const res = await fetch(canvas.dataset.src!);
  if (!res.ok) return;
  const splats = parseSplats(await res.arrayBuffer());
  const { count, centers } = splats;

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  const rows = splats.data.length / 4 / TEX_WIDTH;
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, TEX_WIDTH, rows, 0, gl.RGBA, gl.FLOAT, splats.data);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-2, -2, 2, -2, 2, 2, -2, 2]), gl.STATIC_DRAW);
  const aCorner = gl.getAttribLocation(prog, "aCorner");
  gl.enableVertexAttribArray(aCorner);
  gl.vertexAttribPointer(aCorner, 2, gl.FLOAT, false, 0, 0);

  const order = new Uint32Array(count);
  const indexBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, indexBuf);
  gl.bufferData(gl.ARRAY_BUFFER, order.byteLength, gl.DYNAMIC_DRAW);
  const aIndex = gl.getAttribLocation(prog, "aIndex");
  gl.enableVertexAttribArray(aIndex);
  gl.vertexAttribIPointer(aIndex, 1, gl.UNSIGNED_INT, 0, 0);
  gl.vertexAttribDivisor(aIndex, 1);

  const uView = gl.getUniformLocation(prog, "uView");
  const uProj = gl.getUniformLocation(prog, "uProj");
  const uFocal = gl.getUniformLocation(prog, "uFocal");
  const uViewport = gl.getUniformLocation(prog, "uViewport");
  const uTime = gl.getUniformLocation(prog, "uTime");
  gl.uniform1f(gl.getUniformLocation(prog, "uDist"), 3);
  gl.uniform1f(gl.getUniformLocation(prog, "uHalfDepth"), splats.height * 0.4);
  gl.uniform1f(gl.getUniformLocation(prog, "uHeight"), splats.height);
  gl.uniform1f(gl.getUniformLocation(prog, "uSize"), 0.7);
  gl.uniform1i(gl.getUniformLocation(prog, "uData"), 0);

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  // Additive: overlapping points add up to a glow on the dark panel
  gl.blendFunc(gl.ONE, gl.ONE);

  // Front-to-back counting sort on view depth
  const depths = new Int32Array(count);
  const counts = new Uint32Array(65536);
  const sortByDepth = (view: Float32Array) => {
    const ax = view[2], ay = view[6], az = view[10];
    let min = Infinity, max = -Infinity;
    for (let i = 0; i < count; i++) {
      const d = ax * centers[i * 3] + ay * centers[i * 3 + 1] + az * centers[i * 3 + 2];
      depths[i] = d * 4096;
      if (depths[i] < min) min = depths[i];
      if (depths[i] > max) max = depths[i];
    }
    const scale = 65535 / Math.max(1, max - min);
    counts.fill(0);
    for (let i = 0; i < count; i++) {
      depths[i] = ((depths[i] - min) * scale) | 0;
      counts[depths[i]]++;
    }
    for (let i = 1; i < 65536; i++) counts[i] += counts[i - 1];
    for (let i = count - 1; i >= 0; i--) order[--counts[depths[i]]] = i;
    gl.bindBuffer(gl.ARRAY_BUFFER, indexBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, order);
  };

  const touchPrimary = window.matchMedia("(hover: none)").matches;
  // Frame the figure so it fills ~85% of the canvas height
  const dist = 3;
  let yaw = 0, pitch = 0, sortedYaw = NaN, sortedPitch = NaN;
  let mouseX = 0, mouseY = 0;
  let dragging = false, dragX = 0, dragY = 0, idleSince = 0;
  let width = 0, height = 0, visible = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.round(canvas.clientWidth * dpr);
    height = Math.round(canvas.clientHeight * dpr);
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  };
  resize();
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(container);

  if (!touchPrimary) {
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      mouseX = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      mouseY = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
    });
  }

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    dragX = e.clientX;
    dragY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    yaw -= (e.clientX - dragX) * 0.011;
    pitch = Math.max(-0.5, Math.min(0.5, pitch + (e.clientY - dragY) * 0.006));
    dragX = e.clientX;
    dragY = e.clientY;
  });
  const release = () => {
    dragging = false;
    idleSince = performance.now();
  };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);

  let last = performance.now();
  let shown = false;
  const frame = (now: number) => {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (!dragging && now - idleSince > 400) {
      // the figure turns towards the mouse, i.e. the camera moves the other way
      const targetYaw = touchPrimary ? Math.sin(now / 2600) * 0.45 : -mouseX * MAX_FOLLOW_YAW;
      const targetPitch = touchPrimary ? 0 : -mouseY * MAX_FOLLOW_PITCH;
      // take the short way round after a full spin
      const delta = ((((targetYaw - yaw + Math.PI) % TAU) + TAU) % TAU) - Math.PI;
      const k = 1 - Math.exp(-dt * 4);
      yaw += delta * k;
      pitch += (targetPitch - pitch) * k;
    }

    const view = orbitView(yaw + FRONT_YAW, pitch, dist);
    if (Math.abs(yaw - sortedYaw) > 0.02 || Math.abs(pitch - sortedPitch) > 0.02 || isNaN(sortedYaw)) {
      sortByDepth(view);
      sortedYaw = yaw;
      sortedPitch = pitch;
    }

    const focal = (height * 0.85 * dist) / splats.height;
    gl.uniformMatrix4fv(uView, false, view);
    gl.uniformMatrix4fv(uProj, false, projection(focal, focal, width, height));
    gl.uniform2f(uFocal, focal, focal);
    gl.uniform2f(uViewport, width, height);
    gl.uniform1f(uTime, now / 1000);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, count);

    if (!shown) {
      shown = true;
      container.classList.add("is-splat");
    }
  };
  requestAnimationFrame(frame);
}
