export function animationBuilder(
  onResolve: Function,
  onRun: Function,
  duration = 100
) {
  let startAt = null;
  return new Promise((resolve) => {
    const step = (timestamp) => {
      if (timestamp > startAt + duration) {
        onResolve && onResolve();
        resolve();
        return;
      }
      onRun && onRun(timestamp - startAt);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
