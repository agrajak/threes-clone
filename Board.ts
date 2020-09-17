import { Matrix } from "./models/matrix";
import { Cell, Direction, LEFT, RIGHT, UP, DOWN } from "./interfaces";

export default class Board {
  $: HTMLDivElement;
  matrix = new Matrix();
  snapshot = new Array<Cell>(16);
  isDragging = false;
  direction: Direction;
  moveableCells: HTMLDivElement[] = [];
  maxPos = 0;
  pos = 0;
  isDone = false;

  constructor() {
    this.$ = document.getElementById("board") as HTMLDivElement;
    this.bindHandlers();
    this.render();
    this.setMaxPos();
    this.matrix.add();
    this.matrix.add();
    this.matrix.add();
    this.matrix.add();
    this.matrix.add();
    this.matrix.add();
    this.matrix.add();
    this.matrix.add();
  }
  bindHandlers() {
    this.matrix.on("add", this.render.bind(this));
    this.matrix.on("merge", this.render.bind(this));

    window.addEventListener("resize", this.setMaxPos.bind(this));
    this.$.addEventListener("mousedown", this.dragStart.bind(this));
    this.$.addEventListener("mouseup", this.dragEnd.bind(this));
    this.$.addEventListener("mouseleave", this.dragEnd.bind(this));
    this.$.addEventListener("mousemove", this.dragging.bind(this));
  }
  dragStart() {
    this.isDragging = true;
  }
  dragEnd() {
    this.translateCells(0);
    if (this.isDone) {
      this.matrix.merge(this.direction);
      this.isDone = false;
    }
    this.isDragging = false;
    this.direction = null;
  }
  dragging(event) {
    const { movementX, movementY, clientX, clientY } = event;
    const direction = getDirectionFromMovement(movementX, movementY);
    this.isDone = false;

    if (!this.isDragging) return;
    if (!this.direction) {
      this.direction = direction;
      this.moveableCells = this.matrix
        .getMoveableCellIndices(direction)
        .map((idx) => this.getCardNodeByIdx(idx));
      this.pos = this.isVertical() ? clientX : clientY;
    }

    let delta = this.pos - (this.isVertical() ? clientX : clientY);

    /**
     * ddelta: 방향에 따른 상대 거리. 내가 맨처음에 의도한 방향으로 움직이고 있으면 부호가 -, 반대 방향으로 움직이고 있으면 +
     */
    const ddelta =
      delta * (this.isVertical() ? this.direction[1] : this.direction[0]);

    if (ddelta > 0) {
      this.direction = null;
      return;
    }

    if (ddelta <= -this.maxPos) {
      this.isDone = true;
      delta = betweenMinMax(delta, -this.maxPos, this.maxPos);
    }

    this.translateCells(delta);
  }

  translateCells(delta) {
    const translate = this.isVertical() ? "translateX" : "translateY";
    const indices = this.matrix.getMoveableCellIndices(this.direction);
    this.matrix.iterate(([row, col, idx, cell]) => {
      if (cell.number == 0) return;
      let y = row * this.maxPos,
        x = col * this.maxPos;

      if (indices.indexOf(idx) != -1) {
        if (this.isVertical()) {
          x -= delta;
        } else {
          y -= delta;
        }
      }
      const node = this.$.querySelector(
        `.card[idx="${idx}"]`
      ) as HTMLDivElement;
      node.style.zIndex = `${this.matrix.at(idx).score}`;
      node.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  isVertical() {
    return this.direction == LEFT || this.direction == RIGHT;
  }

  render() {
    this.$.querySelectorAll(".card").forEach((node) => {
      this.$.removeChild(node);
    });
    this.matrix.iterate(([_, _, idx, cell]) => {
      if (cell.number == 0) return;
      const node = createCardNode(idx, this.getCardSize());
      changeCardNode(node, cell.number);
      this.$.appendChild(node);
    });
    this.translateCells(0);
  }
  getCardSize() {
    const cellNode = this.$.querySelector(".cell") as HTMLDivElement;
    return cellNode.offsetHeight;
  }
  setMaxPos() {
    if (this.$.childNodes.length == 0) return 0;
    const gapSize = parseInt(getComputedStyle(this.$).rowGap);
    this.maxPos = gapSize + this.getCardSize();
  }
  getCardPositionByIdx(idx: number) {
    const { top, left } = this.$.querySelector(
      `.cell[idx="${idx}"]`
    ).getBoundingClientRect();
    return [top, left];
  }
  getCardNodeByIdx(idx: number) {
    return this.$.querySelector(`.card[idx="${idx}"]`) as HTMLDivElement;
  }
}

function getDirectionFromMovement(movementX, movementY) {
  if (Math.abs(movementX) > Math.abs(movementY)) {
    if (movementX > 0) return RIGHT;
    else return LEFT;
  } else {
    if (movementY > 0) return DOWN;
    else return UP;
  }
}
function changeCardNode(node: HTMLDivElement, value: number) {
  node.innerText = `${value}`;
  if (value == 0) {
    node.classList.remove("card");
  } else {
    node.classList.add("card");
  }
  node.setAttribute("value", value + "");
}
function createCardNode(idx, size) {
  const node = document.createElement("div");
  node.classList.add("card");
  if (idx !== undefined) {
    node.setAttribute("idx", idx);
  }
  console.log(size);
  node.style.width = node.style.height = `${size}px`;
  return node;
}
function betweenMinMax(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
