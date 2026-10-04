/**
 * Tinder-style drag for photos: the element follows the pointer with a slight
 * tilt, springs back when released, and flies off when flung far or fast
 * enough. By default a flung photo is dealt back into its place; pass
 * `onSwipe` to handle what comes next (e.g. the lightbox shows the next image).
 *
 * Uses the individual `translate`/`rotate` properties so it composes with any
 * `transform` the element already has (polaroid tilt, hover lift, ...).
 * Horizontal drags only on touch (`touch-action: pan-y`), so the page still
 * scrolls normally.
 */

type Direction = -1 | 1;

interface SwipeOptions {
  /** Called after the element has flown off. It is left hidden (opacity 0). */
  onSwipe?: (direction: Direction) => void;
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const SOFT_EASE = "cubic-bezier(0.25, 0.8, 0.25, 1)";
const DRAG_THRESHOLD = 6;

export function swipeable(el: HTMLElement, { onSwipe }: SwipeOptions = {}) {
  let pointerId: number | null = null;
  let startX = 0;
  let startY = 0;
  let dx = 0;
  let dy = 0;
  let dragging = false;
  let suppressClick = false;
  let samples: { x: number; t: number }[] = [];
  let running: Animation[] = [];

  el.classList.add("swipeable");
  el.querySelectorAll("img").forEach((img) => (img.draggable = false));

  const duration = (ms: number) => (reducedMotion.matches ? 1 : ms);
  const stopAnimations = () => {
    running.forEach((a) => a.cancel());
    running = [];
  };
  const animate = (keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
    const animation = el.animate(keyframes, options);
    running.push(animation);
    return animation;
  };

  const position = () => ({
    translate: `${dx}px ${dy * 0.35}px`,
    rotate: `${Math.max(-14, Math.min(14, dx * 0.06))}deg`,
  });

  function dealBack() {
    el.style.opacity = "";
    animate(
      [
        { opacity: 0, scale: "0.92", translate: "0 12px" },
        { opacity: 1, scale: "1", translate: "0 0" },
      ],
      { duration: duration(800), easing: SOFT_EASE },
    );
  }

  async function flyOut(direction: Direction) {
    const from = position();
    const distance = window.innerWidth * 0.5 + el.offsetWidth;
    const flight = animate(
      [
        { ...from, opacity: 1 },
        {
          translate: `${direction * distance}px ${dy * 0.35 + 60}px`,
          rotate: `${direction * 24}deg`,
          opacity: 0,
        },
      ],
      { duration: duration(550), easing: "cubic-bezier(0.4, 0, 0.8, 0.6)", fill: "forwards" },
    );
    el.style.translate = "";
    el.style.rotate = "";
    try {
      await flight.finished;
    } catch {
      return; // Interrupted by a new drag
    }
    el.style.opacity = "0";
    stopAnimations();
    if (onSwipe) {
      onSwipe(direction);
    } else {
      dealBack();
    }
  }

  function springBack() {
    const from = position();
    el.style.translate = "";
    el.style.rotate = "";
    animate([from, { translate: "0 0", rotate: "0deg" }], {
      duration: duration(700),
      easing: SOFT_EASE,
    });
  }

  function end(event: PointerEvent) {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    if (!dragging) return;
    dragging = false;
    el.classList.remove("is-dragging");

    // Prevent the click that follows a drag (e.g. opening the lightbox)
    suppressClick = true;
    setTimeout(() => (suppressClick = false), 50);

    const first = samples[0];
    const last = samples[samples.length - 1];
    const velocity = first && last && last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0;
    const flung =
      event.type !== "pointercancel" &&
      (Math.abs(dx) > el.offsetWidth * 0.4 ||
        (Math.abs(velocity) > 0.5 && Math.sign(velocity) === Math.sign(dx) && Math.abs(dx) > 30));

    if (flung) {
      flyOut(dx > 0 ? 1 : -1);
    } else {
      springBack();
    }
  }

  el.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || pointerId !== null) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    dx = 0;
    dy = 0;
    samples = [];
  });

  el.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    // The button was released somewhere we never heard about (e.g. outside the window)
    if (event.pointerType === "mouse" && event.buttons === 0) {
      end(event);
      return;
    }
    dx = event.clientX - startX;
    dy = event.clientY - startY;

    if (!dragging) {
      const horizontal = Math.abs(dx) > DRAG_THRESHOLD && Math.abs(dx) > Math.abs(dy);
      const anyDirection = Math.hypot(dx, dy) > DRAG_THRESHOLD;
      if (event.pointerType === "mouse" ? !anyDirection : !horizontal) {
        // A vertical touch gesture is a scroll: let the browser have it
        if (event.pointerType !== "mouse" && Math.abs(dy) > DRAG_THRESHOLD) pointerId = null;
        return;
      }
      dragging = true;
      stopAnimations();
      el.style.opacity = "";
      el.setPointerCapture(event.pointerId);
      el.classList.add("is-dragging");
    }

    const now = performance.now();
    samples.push({ x: event.clientX, t: now });
    samples = samples.filter((s) => now - s.t < 100);

    const { translate, rotate } = position();
    el.style.translate = translate;
    el.style.rotate = rotate;
  });

  // The pointer is only captured once a drag starts, so before that the release
  // can happen anywhere: listen on the window to always clear the press
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
  el.addEventListener("lostpointercapture", end);
  el.addEventListener("dragstart", (event) => event.preventDefault());
  el.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true,
  );
}
