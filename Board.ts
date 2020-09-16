import { Matrix } from "./models/matrix";
import { Cell, Direction, LEFT, RIGHT, UP, DOWN } from "./interfaces";

export default class Board {
  $: HTMLDivElement;
  matrix = new Matrix();
  snapshot = new Array<Cell>(16);
  isDragging = false;
  direction: Direction;
  moveableCells: HTMLDivElement[];
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
    this.$.addEventListener("mousedown", () => {
      this.isDragging = true;
    });
    this.$.addEventListener("mouseup", () => {
      this.isDragging = false;
      this.direction = null;
      this.moveableCells.forEach((node) => {
        node.style.transform = "";
      });
    });
    this.$.addEventListener(
      "mousemove",
      ({ movementX, movementY, clientX, clientY }) => {
        if (!this.isDragging) return;
        if (!this.direction) {
          this.direction = getDirectionFromMovement(movementX, movementY);
          this.moveableCells = this.matrix
            .getMoveableCellIndices(this.direction)
            .map((idx) => this.getCellNodeByIdx(idx));
          this.pos = this.getPosByDirection(clientX, clientY);
        }
        const delta = this.pos - this.getPosByDirection(clientX, clientY);
        console.log(this.moveableCells);
        console.log(this.pos, delta, this.direction);
        if (this.direction == LEFT || this.direction == RIGHT) {
          this.moveableCells.forEach((node) => {
            node.style.transform = `translateX(${delta}px)`;
          });
        }
      }
    );
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
  }
}

function getDirectionFromMovement(movementX, movementY) {
  if (Math.abs(movementX) > Math.abs(movementY)) {
    if (Math.abs(movementX) > 0) return RIGHT;
    else return LEFT;
  } else {
    if (Math.abs(movementY) > 0) return DOWN;
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
