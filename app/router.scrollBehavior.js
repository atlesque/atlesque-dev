export default function scrollBehavior(to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash,
      offset: { x: 0, y: 80 },
    };
  }
}
