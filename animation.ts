import Board from "./Board";

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
export class BoardAnimation {
  board: Board;
  constructor(board) {
    this.board = board;
  }
}
export function linear(from, to, duration) {
  return function (timestamp) {
    return (timestamp / duration) * (to - from) + from;
  };
}
