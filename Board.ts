import { Matrix } from "./models/matrix";
import { Cell } from "./interfaces";

export default class Board {
  $: HTMLDivElement;
  matrix = new Matrix();
  snapshot = new Array<Cell>(16);
  constructor() {
    this.$ = document.getElementById("board") as HTMLDivElement;
    this.bindHandlers();
    this.render();
    this.matrix.add();
    this.matrix.add();
  }
  bindHandlers() {
    this.matrix.on("add", this.render.bind(this));
  }
  getCellNodeByIdx(idx: number) {
    return this.$.childNodes.item(idx) as HTMLDivElement;
  }
  render() {
    this.matrix.iterate(([_, _, idx, cell]) => {
      if (this.snapshot[idx] !== cell) {
        if (this.snapshot[idx] == undefined) {
          this.$.appendChild(createCellNode());
        }
        const node = this.getCellNodeByIdx(idx);
        changeCellNode(node, cell.number);
      }
    });
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
}
function createCellNode() {
  const node = document.createElement("div");
  node.classList.add("cell");
  const innerNode = document.createElement("div");
  innerNode.classList.add("inner");
  node.appendChild(innerNode);
  return node;
}
