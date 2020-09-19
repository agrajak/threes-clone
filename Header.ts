export class Header {
  $: HTMLDivElement;
  constructor($) {
    this.$ = $;
  }
  setNext(next) {
    (this.$.querySelector(
      "#next-number"
    ) as HTMLDivElement).innerText = `${next}`;
  }
  setScore(score) {
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
