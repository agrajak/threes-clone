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
    const delta = linear(from, to, duration);
    return animationFactory(
      null,
      (dt) => this.board.translateCards(delta(dt)),
      duration
    );
  }
  animateNext(nextPos, number, duration = 100) {
    const node = createCardNode(99);
    this.board.$.appendChild(node);
    changeCardNode(node, number);
    node.style.zIndex = "10";

    const [dx, dy] = this.board.direction;
    const maxPos = this.board.calculateMaxPos();

    const x = linear(nextPos[0] - dx, nextPos[0], duration);
    const y = linear(nextPos[1] - dy, nextPos[1], duration);
    const opacity = linear(0, 1, duration);

    node.style.transform = `translate(${y(0) * maxPos}px, ${x(0) * maxPos}px)`;
    this.board.resizeCards();

    return animationFactory(
      () => {
        this.board.$.removeChild(node);
      },
      (dt) => {
        node.style.transform = `translate(${y(dt) * maxPos}px, ${
          x(dt) * maxPos
        }px)`;
        node.style.opacity = `${opacity(dt)}`;
      },
      duration
    );
  }
  flipBoard(duration = 200, renderer: Function) {
    const deg = linear(0, 180, duration);
    const board = this.board.$;
    let isFlipped = false;
    return animationFactory(
      null,
      (dt) => {
        const halfWayDone = dt >= duration / 2;
        if (halfWayDone && !isFlipped) {
          isFlipped = true;
          renderer();
        }
        board.style.transform = `rotateY(${
          halfWayDone ? 180 - deg(dt) : deg(dt)
        }deg)`;
      },
      duration
    );
  }
  flipMergedCards(merged, duration = 200) {
    const maxPos = this.board.calculateMaxPos();
    const [dx, dy] = this.board.direction;
    const deg = linear(0, 180, duration);
    const rotateDirection = this.board.isVertical() ? "rotateY" : "rotateX";

    if (merged.length == 0) return Promise.resolve();

    merged.forEach(({ row, col }) => {
      this.board.hideCardByIdx(toIdx([row - dx, col - dy]));
    });

    return animationFactory(
      null,
      (dt) => {
        const halfWayDone = dt >= duration / 2;

        merged.forEach(({ idx, row, col, before, after }) => {
          const node = this.board.getCardNodeByIdx(idx);
          const x = row * maxPos,
            y = col * maxPos;

          changeCardNode(node, halfWayDone ? after : before);

          node.style.zIndex = `20`;
          node.style.transform = `translate(${y}px, ${x}px) ${rotateDirection}(${Math.floor(
            halfWayDone ? 180 - deg(dt) : deg(dt)
          )}deg)`;
        });
      },
      duration
    );
  }
}
export function linear(from, to, duration) {
  return function (timestamp) {
    return (timestamp / duration) * (to - from) + from;
  };
}

export function delay(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
