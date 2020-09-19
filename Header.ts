import { animationFactory, linear } from "./animation";

export class Header {
  $: HTMLDivElement;
  score: number = 0;
  next: number;
  constructor() {
    this.$ = document.getElementById("header") as HTMLDivElement;
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
