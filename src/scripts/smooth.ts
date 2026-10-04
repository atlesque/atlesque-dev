/**
 * Eases a set of CSS custom properties on an element towards target values,
 * one animation frame at a time. Pointer-driven effects (magnetic buttons,
 * tilt, spotlight) set targets on every pointermove; the element glides after
 * them instead of jumping, and settles smoothly when the pointer leaves.
 *
 * While the loop runs, the element gets an `is-smoothing` class so CSS can
 * drop its own transition for the properties being driven from here.
 */
export function smoothProps(
  el: HTMLElement,
  initial: Record<string, number>,
  { unit = "px", ease = 0.1 }: { unit?: string; ease?: number } = {},
) {
  const current = { ...initial };
  const target = { ...initial };
  let frame = 0;

  const tick = () => {
    let settled = true;
    for (const key in target) {
      const delta = target[key] - current[key];
      if (Math.abs(delta) > 0.01) {
        settled = false;
        current[key] += delta * ease;
      } else {
        current[key] = target[key];
      }
      el.style.setProperty(key, `${current[key].toFixed(3)}${unit}`);
    }
    if (settled) {
      frame = 0;
      el.classList.remove("is-smoothing");
      return;
    }
    frame = requestAnimationFrame(tick);
  };

  /** Sets new targets; `instant` jumps there without easing. */
  return (next: Record<string, number>, instant = false) => {
    Object.assign(target, next);
    if (instant) Object.assign(current, next);
    if (!frame) {
      el.classList.add("is-smoothing");
      frame = requestAnimationFrame(tick);
    }
  };
}
