import { Matrix } from "./models/matrix";

export default class Board {
  $: HTMLDivElement;
  matrix = new Matrix();
  constructor() {
    this.$ = document.getElementById("board") as HTMLDivElement;
    this.render();
  }
  render() {
    this.matrix.iterate(([row, col, cell]) => {
      console.log(row, col, cell);
    });
  }
}
