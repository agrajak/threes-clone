import { Matrix } from "./models/matrix";
import { Cell, Direction, LEFT, RIGHT, UP, DOWN } from "./interfaces";
import {
  changeCardNode,
  createCardNode,
  getDirectionFromMovement,
  pickRandomOne,
  toIdx,
  toRowCol,
  touchEventHelper,
} from "./utils";
import { Header } from "./Header";
import { BoardAnimation, linear } from "./animation";

const DURATION = 200;
const SEMIAUTO_PUSH_RATIO = 0.6;
export default class Board {
  $: HTMLDivElement;
  header: Header;
  animation: BoardAnimation;
  matrix = new Matrix();

  isDragging = false;
  direction: Direction;
  delta = 0;
  pos = 0;
  x = null;
  y = null;
  isMoving = false;

  constructor() {
    this.$ = document.getElementById("board") as HTMLDivElement;
    this.header = new Header(this);
    this.animation = new BoardAnimation(this);
    this.bindHandlers();
    this.matrix.init();
  }
  bindHandlers() {
    this.matrix.on("add", ({ nextPos, number }) => {
      this.animation.animateNext(nextPos, number).then(() => {
        this.render.bind(this)();
        if (this.matrix.getScore() != 0 && this.matrix.isFinished()) {
          setTimeout(() => {
            alert(`님 주금! 당신의 점수 [${this.matrix.getScore()}]`);
            this.matrix.init();
          }, 500);
          return;
        }
      });
    });
    this.matrix.on("init", this.render.bind(this));
    this.matrix.on("merge", (merged) => {
      this.animation.flipMergedCards(merged);
    });
    this.matrix.on("set-next", this.header.setNext.bind(this.header));
    this.matrix.on("set-score", this.header.setScore.bind(this.header));

    window.addEventListener("resize", this.onResize.bind(this));
    window.addEventListener("mousedown", this.dragStart.bind(this));
    window.addEventListener("mouseup", this.dragEnd.bind(this));
    window.addEventListener("mouseleave", this.dragEnd.bind(this));
    window.addEventListener("mousemove", this.dragging.bind(this));
    window.addEventListener("touchstart", this.dragStart.bind(this));
    window.addEventListener("touchend", this.dragEnd.bind(this));
    window.addEventListener("touchmove", this.dragging.bind(this));
    window.addEventListener("keydown", this.onKeyDown.bind(this));
  }
  onKeyDown(event: KeyboardEvent) {
    const maxPos = this.calculateMaxPos();
    const { key } = event;
    this.direction = null;
    switch (key) {
      case "ArrowUp":
        this.direction = UP;
        break;
      case "ArrowDown":
        this.direction = DOWN;
        break;
      case "ArrowLeft":
        this.direction = LEFT;
        break;
      case "ArrowRight":
        this.direction = RIGHT;
        break;
    }
    if (!this.direction) return;
    this.animation.animateCards(0, maxPos, 60).then(() => {
      this.matrix.move(this.direction);
    });
  }
  onResize() {
    this.resizeCards();
    this.translateCards(0);
  }
  dragStart(event) {
    const { clientX, clientY } = touchEventHelper(event);
    this.x = clientX;
    this.y = clientY;
    this.isDragging = true;
  }
  dragEnd() {
    const maxPos = this.calculateMaxPos();
    let delta = Math.min(maxPos, this.delta);
    if (delta / maxPos > SEMIAUTO_PUSH_RATIO) {
      this.animation.animateCards(delta, maxPos, 70).then(() => {
        this.matrix.move(this.direction);
        this.header.highlightNext(false);
        this.delta = 0;
        this.isDragging = false;
        this.direction = null;
      });
    } else {
      this.animation.animateCards(delta, 0, 70).then(() => {
        this.isDragging = false;
        this.direction = null;
        this.pos = null;
      });
    }
  }

  dragging(event) {
    if (!this.isDragging) return;
    const { clientX, clientY } = touchEventHelper(event);
    const maxPos = this.calculateMaxPos();
    const dx = clientX - this.x,
      dy = clientY - this.y;
    if (dx == 0 && dy == 0) return;
    this.x = clientX;
    this.y = clientY;
    const direction = getDirectionFromMovement(dx, dy);

    if (!this.direction) {
      this.direction = direction;

      this.pos = this.isVertical() ? clientX : clientY;
    }
    let pos = this.isVertical() ? clientX : clientY;

    /**
     * delta: 방향에 따른 상대 거리. 내가 맨처음에 의도한 방향으로 움직이고 있으면 부호가 +, 반대 방향으로 움직이고 있으면 -
     */
    const delta =
      (pos - this.pos) *
      (this.isVertical() ? this.direction[1] : this.direction[0]);

    if (delta < 0) {
      this.direction = null;
      return;
    }

    this.header.highlightNext(delta / maxPos > SEMIAUTO_PUSH_RATIO);
    this.delta = delta;

    this.translateCards(Math.min(delta, maxPos));
  }

  translateCards(delta) {
    const [dx, dy] = this.direction ?? [0, 0];
    const indices = this.matrix.getMoveableCellIndices(this.direction);
    const maxPos = this.calculateMaxPos();
    this.matrix.iterate(([row, col, idx, cell]) => {
      if (cell.number == 0) return;
      let y = row * maxPos,
        x = col * maxPos;

      if (indices.indexOf(idx) != -1) {
        y += delta * dx;
        x += delta * dy;
      }
      const node = this.getCardNodeByIdx(idx);

      node.style.zIndex = `${this.matrix.at(idx).score}`;
      node.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  isVertical() {
    return this.direction == LEFT || this.direction == RIGHT;
  }

  render() {
    this.$.innerHTML = "";
    // this.$.querySelectorAll(".card").forEach((node) => {
    //   this.$.removeChild(node);
    // });
    this.matrix.iterate(([row, col, idx, cell]) => {
      if (cell.number == 0) return;
      const node = createCardNode(idx);
      changeCardNode(node, cell.number);
      this.$.appendChild(node);
    });
    this.resizeCards();
    this.translateCards(0);
  }

  renderNote() {
    this.$.innerHTML = `도움말임 ㅋ`;
    this.$.classList.toggle("note");
  }

  resizeCards() {
    this.$.querySelectorAll(".card").forEach((node) => {
      if (!(node instanceof HTMLDivElement)) return;
      node.style.width = node.style.height = `${this.calculateCardSize()}px`;
    });
  }

  hideCardByIdx(idx) {
    const node = this.getCardNodeByIdx(idx);
    if (node) {
      node.style.display = "none";
    }
  }
  calculateCardSize() {
    const cellNode = this.$.querySelector(".cell") as HTMLDivElement;
    return cellNode.offsetHeight;
  }

  calculateMaxPos() {
    if (this.$.childNodes.length == 0) return 0;
    const gapSize = parseInt(getComputedStyle(this.$).rowGap);
    return gapSize + this.calculateCardSize();
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
