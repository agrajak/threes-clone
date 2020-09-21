import { animationFactory, linear } from "./animation";
import Board from "./Board";

export class Header {
  $: HTMLDivElement;
  score: number = 0;
  next: number;
  board: Board;
  constructor(board) {
    this.board = board;
    this.$ = document.getElementById("header") as HTMLDivElement;
    this.$.addEventListener("click", (event) => {
      if (!(event.target instanceof HTMLDivElement)) return;
      if (event.target.id == "help") {
        if (this.board.$.classList.contains("note")) {
          this.board.animation.flipBoard(
            200,
            this.board.render.bind(this.board)
          );
          return;
        }
        this.board.animation.flipBoard(
          200,
          this.board.renderNote.bind(this.board)
        );
      }
    });
  }
  setNext(next) {
    (this.$.querySelector(
      "#next-number"
    ) as HTMLDivElement).innerText = `${next}`;
    this.next = next;
  }
  setScore(score) {
    const duration = 200;
    const dScore = linear(this.score, score, duration);
    const animation = animationFactory(
      null,
      (dt) => {
        this.displayScore(Math.floor(dScore(dt)));
      },
      duration
    );
    console.log(animation);
    animation.then();

    this.score = score;
  }
  displayScore(score) {
    (this.$.querySelector(
      "#score-number"
    ) as HTMLDivElement).innerText = `${score}`;
  }
  highlightNext(flag: boolean) {
    const scoreBox = this.$.querySelector("#score") as HTMLDivElement;
    if (flag) scoreBox.classList.add("highlight");
    else scoreBox.classList.remove("highlight");
  }
}
