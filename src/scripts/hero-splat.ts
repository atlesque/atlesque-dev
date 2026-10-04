/**
 * Renders the hero photo as a coloured point cloud (public/models/hero.splat,
 * built by scripts/generate-hero-splat.py) with a tiny WebGL point renderer.
 *
 * - Fine pointers: the figure turns towards the mouse.
 * - Touch: it sways slowly on its own.
 * - Anyone can drag to spin it all the way around.
 * Falls back to the plain photo without WebGL, without JS or when the user
 * prefers reduced motion (the canvas is simply never shown).
 */

const STRIDE = 10;
const MAX_FOLLOW_YAW = 0.7; // radians the figure turns towards the mouse
const MAX_FOLLOW_PITCH = 0.18;
const TAU = Math.PI * 2;

const VERT = `
attribute vec3 aPos; attribute vec3 aCol; attribute float aSize;
uniform mat4 uMvp; uniform float uScale;
varying vec3 vCol;
void main() {
  vec4 p = uMvp * vec4(aPos, 1.0);
  gl_Position = p;
  gl_PointSize = aSize * uScale / p.w;
  vCol = aCol;
}`;
const FRAG = `
precision mediump float;
varying vec3 vCol;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vCol * (1.15 - d * 0.5), 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

const FOCAL = 5.6;
const DIST = 4.2;

/** Column-major projection * translate(0,0,-DIST) * Rx(pitch) * Ry(yaw). */
function viewProjection(yaw: number, pitch: number, aspect: number): Float32Array {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const near = 0.1, far = 10;
  const rows = [
    [cy, 0, sy],
    [sp * sy, cp, -sp * cy],
    [-cp * sy, sp, cp * cy],
  ];
  const a = FOCAL / aspect, b = FOCAL, c = (far + near) / (near - far), d = (2 * far * near) / (near - far);
  const m = new Float32Array(16);
  for (let j = 0; j < 3; j++) {
    m[j * 4] = a * rows[0][j];
    m[j * 4 + 1] = b * rows[1][j];
    m[j * 4 + 2] = c * rows[2][j];
    m[j * 4 + 3] = -rows[2][j];
  }
  m[14] = -c * DIST + d;
  m[15] = DIST;
  return m;
}

export async function initHeroSplat(container: HTMLElement, canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
  if (!gl) return;

  const buf = await (await fetch(canvas.dataset.src!)).arrayBuffer();
  const count = buf.byteLength / STRIDE;
  const view = new DataView(buf);
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const size = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const o = i * STRIDE;
    for (let k = 0; k < 3; k++) {
      pos[i * 3 + k] = view.getInt16(o + k * 2, true) / 4096;
      col[i * 3 + k] = view.getUint8(o + 6 + k) / 255;
    }
    size[i] = view.getUint8(o + 9) / 100;
  }

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  for (const [name, data, n] of [["aPos", pos, 3], ["aCol", col, 3], ["aSize", size, 1]] as const) {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, n, gl.FLOAT, false, 0, 0);
  }
  const uMvp = gl.getUniformLocation(prog, "uMvp");
  const uScale = gl.getUniformLocation(prog, "uScale");
  gl.enable(gl.DEPTH_TEST);

  const touchPrimary = window.matchMedia("(hover: none)").matches;
  let yaw = 0, pitch = 0;
  let mouseX = 0, mouseY = 0; // -1..1 relative to the figure
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
    yaw += (e.clientX - dragX) * 0.011;
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
  const frame = (now: number) => {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (!dragging && now - idleSince > 400) {
      const targetYaw = touchPrimary ? Math.sin(now / 2600) * 0.45 : mouseX * MAX_FOLLOW_YAW;
      const targetPitch = touchPrimary ? 0 : mouseY * MAX_FOLLOW_PITCH;
      // take the short way round after a full spin
      const delta = ((targetYaw - yaw + Math.PI) % TAU + TAU) % TAU - Math.PI;
      const k = 1 - Math.exp(-dt * 4);
      yaw += delta * k;
      pitch += (targetPitch - pitch) * k;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(uMvp, false, viewProjection(yaw, pitch, width / height));
    gl.uniform1f(uScale, 0.0125 * (FOCAL * height) / 2);
    gl.drawArrays(gl.POINTS, 0, count);
  };
  requestAnimationFrame(frame);

  container.classList.add("is-splat");
}
