import { Matrix } from "./models/matrix";
import { Cell, Direction, LEFT, RIGHT, UP, DOWN } from "./interfaces";
import { pickRandomOne } from "./utils";

const DURATION = 200;
export default class Board {
  $: HTMLDivElement;
  matrix = new Matrix();
  isDragging = false;
  direction: Direction;
  moveableCells: HTMLDivElement[] = [];
  maxPos = 0;
  delta = 0;
  pos = 0;
  next = null;
  x = null;
  y = null;
  isMoving = false;

  constructor() {
    this.$ = document.getElementById("board") as HTMLDivElement;
    this.bindHandlers();
    this.render();
    this.setMaxPos();
    this.matrix.init();
    this.setNext();
  }
  bindHandlers() {
    this.matrix.on("add", this.render.bind(this));
    this.matrix.on("merge", this.render.bind(this));

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
    const { key } = event;
    console.log(key);
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
    this.translate(0, this.maxPos, 60).then(() => {
      this.move();
    });
  }
  onResize() {
    this.setMaxPos();
    this.resizeCards();
    this.translateCells(0);
  }
  dragStart(event) {
    const { clientX, clientY } = this.touchEventHelper(event);
    this.x = clientX;
    this.y = clientY;
    this.isDragging = true;
  }
  dragEnd() {
    if (this.moveableCells.length == 0) return;
    let delta = Math.min(this.maxPos, this.delta);
    if (delta / this.maxPos > 0.6) {
      this.translate(delta, this.maxPos, 70).then(() => {
        this.move();
      });
    } else {
      this.translate(delta, 0, 70).then(() => {
        this.isDragging = false;
        this.direction = null;
        this.pos = null;
      });
    }
  }
  move() {
    if (!this.direction) return;
    this.matrix.merge(this.direction);
    const done = this.matrix.add(this.direction, this.next);
    this.setNext();
    this.isDragging = false;
    this.direction = null;
    this.delta = 0;
    if (!done) {
      alert("님 주금!");
      this.matrix.init();

      return;
    }
  }
  translate(from = 0, to = this.maxPos, duration = 100) {
    const isLocked = this.isMoving == true;
    this.isMoving = true;
    let startAt = null;
    let translateCells = this.translateCells.bind(this);
    function interpolate(timestamp) {
      return ((timestamp - startAt) / duration) * (to - from) + from;
    }
    return new Promise((resolve, reject) => {
      if (isLocked) reject();
      const step = (timestamp) => {
        if (!startAt) startAt = timestamp;
        if (timestamp > startAt + duration) {
          resolve();
          this.isMoving = false;
          translateCells(to);
          return;
        }
        translateCells(interpolate(timestamp));
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  touchEventHelper(event: MouseEvent | TouchEvent) {
    if (event instanceof MouseEvent) return event;
    return event.touches[0];
  }
  getNext() {
    let pick = pickRandomOne([1, 2, 3]);
    if (pick == 1 || pick == 2) {
      const numOfOne = this.matrix.m
        .map((cell) => cell.number)
        .filter((x) => x == 1).length;
      const numOfTwo = this.matrix.m
        .map((cell) => cell.number)
        .filter((x) => x == 2).length;

      if (numOfOne > numOfTwo + 2) return 2;
      else if (numOfTwo > numOfOne + 2) return 1;
      return pick;
    }
    return 3;
  }
  setNext() {
    this.next = this.getNext();

    (document.body.querySelector(
      "#next-number"
    ) as HTMLDivElement).innerText = `${this.next}`;
  }
  dragging(event) {
    if (!this.isDragging) return;
    const { clientX, clientY } = this.touchEventHelper(event);
    const dx = clientX - this.x,
      dy = clientY - this.y;
    if (dx == 0 && dy == 0) return;
    this.x = clientX;
    this.y = clientY;
    const direction = getDirectionFromMovement(dx, dy);

    if (!this.direction) {
      this.direction = direction;
      this.moveableCells = this.matrix
        .getMoveableCellIndices(direction)
        .map((idx) => this.getCardNodeByIdx(idx));

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

    this.delta = delta;

    this.translateCells(Math.min(delta, this.maxPos));
  }

  translateCells(delta) {
    const [dx, dy] = this.direction ?? [0, 0];
    const indices = this.matrix.getMoveableCellIndices(this.direction);
    this.matrix.iterate(([row, col, idx, cell]) => {
      if (cell.number == 0) return;
      let y = row * this.maxPos,
        x = col * this.maxPos;

      if (indices.indexOf(idx) != -1) {
        y += delta * dx;
        x += delta * dy;
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
      const node = createCardNode(idx);
      changeCardNode(node, cell.number);
      this.$.appendChild(node);
    });
    this.resizeCards();
    this.translateCells(0);
  }

  resizeCards() {
    this.$.querySelectorAll(".card").forEach((node) => {
      if (!(node instanceof HTMLDivElement)) return;
      node.style.width = node.style.height = `${this.getCardSize()}px`;
    });
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
function createCardNode(idx) {
  const node = document.createElement("div");
  node.classList.add("card");
  if (idx !== undefined) {
    node.setAttribute("idx", idx);
  }
  return node;
}
