import { DOWN, LEFT, Point, RIGHT, UP } from "./interfaces";

export function getRandomInt(max: number = 1) {
  return Math.floor(Math.random() * max);
}
export function getOneOrTwo() {
  return getRandomInt(2) + 1;
}
export function getRandomPoint(): Point {
  return [getRandomInt(4), getRandomInt(4)];
}
export function toRowCol(idx): Point {
  return [Math.floor(idx / 4), idx % 4];
}
export function toIdx([row, col]: Point) {
  return row * 4 + col;
}
export function pickRandomOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getDirectionFromMovement(movementX, movementY) {
  if (Math.abs(movementX) > Math.abs(movementY)) {
    if (movementX > 0) return RIGHT;
    else return LEFT;
  } else {
    if (movementY > 0) return DOWN;
    else return UP;
  }
}
export function changeCardNode(node: HTMLDivElement, value: number) {
  node.innerText = `${value}`;
  if (value == 0) {
    node.classList.remove("card");
  } else {
    node.classList.add("card");
  }
  node.setAttribute("value", value + "");
}
export function createCardNode(idx) {
  const node = document.createElement("div");
  node.classList.add("card");
  if (idx !== undefined) {
    node.setAttribute("idx", idx);
  }
  return node;
}

export function touchEventHelper(event: MouseEvent | TouchEvent) {
  if (event instanceof MouseEvent) return event;
  return event.touches[0];
}
