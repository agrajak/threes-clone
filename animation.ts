import Board from "./Board";
import { changeCardNode, createCardNode, toIdx } from "./utils";

export function animationFactory(
  onResolve: Function,
  onRun: Function,
  duration = 100
) {
  let startAt = null;
  return new Promise((resolve) => {
    const step = (timestamp) => {
      if (!startAt) startAt = timestamp;
      if (timestamp > startAt + duration) {
        if (onRun) onRun(duration);
        if (onResolve) onResolve();
        resolve();
        return;
      }
      if (onRun) onRun(timestamp - startAt);
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
  animateCards(from = 0, to = 1, duration = 100) {
    let startAt = null;
    const d = linear(from, to, duration);
    return new Promise((resolve, reject) => {
      const step = (timestamp) => {
        if (!startAt) startAt = timestamp;
        const dt = timestamp - startAt;
        if (timestamp > startAt + duration) {
          resolve();
          this.board.translateCards(to);
          return;
        }
        this.board.translateCards(d(dt));
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  animateNext(nextPos, number, duration = 100) {
    const node = createCardNode(99);
    const [dx, dy] = this.board.direction;
    this.board.$.appendChild(node);
    changeCardNode(node, number);
    node.style.zIndex = "10";

    const x = linear(nextPos[0] - dx, nextPos[0], duration);
    const y = linear(nextPos[1] - dy, nextPos[1], duration);
    const maxPos = this.board.calculateMaxPos();
    const opacity = linear(0, 1, duration);

    node.style.transform = `translate(${y(0) * maxPos}px, ${x(0) * maxPos}px)`;
    this.board.resizeCards();
    let startAt = null;

    return new Promise((resolve, reject) => {
      const step = (timestamp) => {
        if (!startAt) startAt = timestamp;
        const dt = timestamp - startAt;
        node.style.transform = `translate(${y(dt) * maxPos}px, ${
          x(dt) * maxPos
        }px)`;
        node.style.opacity = `${opacity(dt)}`;
        if (timestamp > startAt + duration) {
          this.board.$.removeChild(node);
          resolve();
          return;
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  flipMergedCards(merged, duration = 200) {
    let startAt = null;
    const maxPos = this.board.calculateMaxPos();
    const [dx, dy] = this.board.direction;
    const rotate = linear(0, 180, duration);
    const rotateDirection = this.board.isVertical() ? "rotateY" : "rotateX";
    const reverseRotate = linear(180, 0, duration);

    merged.forEach(({ row, col }) => {
      const deMergedIdx = toIdx([row - dx, col - dy]);
      const node = this.board.getCardNodeByIdx(deMergedIdx);
      if (node) {
        node.style.display = "none";
      }
    });

    let halfWayDone = false;

    return new Promise((resolve) => {
      if (merged.length == 0) resolve();
      const step = (timestamp) => {
        if (!startAt) startAt = timestamp;
        const dt = timestamp - startAt;
        if (dt >= duration / 2) halfWayDone = true;
        merged.forEach(({ idx, row, col, before, after }) => {
          const node = this.board.getCardNodeByIdx(idx);
          const x = row * maxPos,
            y = col * maxPos;

          changeCardNode(node, halfWayDone ? after : before);

          node.style.zIndex = `20`;
          node.style.transform = `translate(${y}px, ${x}px) ${rotateDirection}(${Math.floor(
            halfWayDone ? reverseRotate(dt) : rotate(dt)
          )}deg)`;
        });
        if (timestamp > startAt + duration) {
          resolve();
          return;
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
}
export function linear(from, to, duration) {
  return function (timestamp) {
    return (timestamp / duration) * (to - from) + from;
  };
}
