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
  }
  bindHandlers() {
    this.matrix.on("add", this.render.bind(this));
  }
  render() {
    this.matrix.iterate(([row, col, idx, cell]) => {
      if (this.snapshot[idx] !== cell) {
        if (this.snapshot[idx] == undefined) {
          this.$.appendChild(createCellNode());
        }
        const nodeItem = this.$.childNodes.item(idx) as HTMLDivElement;
        nodeItem.innerText = cell.number;
      }
    });
  }
}

function createCellNode() {
  const node = document.createElement("div");
  node.classList.add("cell");
  return node;
}
