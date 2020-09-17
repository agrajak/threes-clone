import { Matrix } from "./models/matrix";
import { Cell, Direction, LEFT, RIGHT, UP, DOWN } from "./interfaces";

export default class Board {
  $: HTMLDivElement;
  matrix = new Matrix();
  snapshot = new Array<Cell>(16);
  isDragging = false;
  direction: Direction;
  moveableCells: HTMLDivElement[];
  maxPos = 0;
  pos = 0;

  constructor() {
    this.$ = document.getElementById("board") as HTMLDivElement;
    this.bindHandlers();
    this.render();
    this.matrix.add();
    this.matrix.add();
  }
  bindHandlers() {
    this.matrix.on("add", this.render.bind(this));

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
    this.isDragging = false;
    this.direction = null;
    this.moveableCells.forEach((node) => {
      node.style.transform = "";
    });
  }
  dragging(event) {
    const { movementX, movementY, clientX, clientY } = event;

    if (!this.isDragging) return;
    if (!this.direction) {
      this.direction = getDirectionFromMovement(movementX, movementY);
      this.moveableCells = this.matrix
        .getMoveableCellIndices(this.direction)
        .map((idx) => this.getCellNodeByIdx(idx));
      this.pos = this.getPosByDirection(clientX, clientY);
    }

    const delta = betweenMinMax(
      this.pos - this.getPosByDirection(clientX, clientY),
      -this.maxPos,
      this.maxPos
    );

    const translate =
      this.direction == LEFT || this.direction == RIGHT
        ? "translateX"
        : "translateY";

    this.moveableCells.forEach((node) => {
      node.style.zIndex = "2";
      node.style.transform = `${translate}(${-delta}px)`;
    });
  }
  getPosByDirection(clientX, clientY) {
    return this.direction == LEFT || this.direction == RIGHT
      ? clientX
      : clientY;
  }

  getCellNodeByIdx(idx: number) {
    return this.$.childNodes.item(idx) as HTMLDivElement;
  }

  render() {
    this.matrix.iterate(([_, _, idx, cell]) => {
      if (this.snapshot[idx] !== cell) {
        if (this.snapshot[idx] == undefined) {
          this.$.appendChild(createCellNode(idx));
        }
        const node = this.getCellNodeByIdx(idx);
        changeCellNode(node, cell.number);
      }
    });
    this.snapshot = this.matrix.m;
    this.setMaxPos();
  }
  setMaxPos() {
    if (this.$.childNodes.length == 0) return 0;
    const gapSize = parseInt(getComputedStyle(this.$).rowGap);
    const node = this.$.childNodes.item(0) as HTMLDivElement;
    this.maxPos = gapSize + node.offsetHeight;
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
function changeCellNode(node: HTMLDivElement, value: number) {
  const innerNode = node.querySelector(".inner") as HTMLDivElement;
  innerNode.innerText = "" + value;
  if (value == 0) {
    node.classList.remove("card");
  } else {
    node.classList.add("card");
  }
  node.setAttribute("value", value + "");
}
function createCellNode(idx) {
  const node = document.createElement("div");
  node.classList.add("cell");
  const innerNode = document.createElement("div");
  innerNode.classList.add("inner");
  node.appendChild(innerNode);
  if (idx !== undefined) {
    node.setAttribute("idx", idx);
  }
  return node;
}
function betweenMinMax(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
