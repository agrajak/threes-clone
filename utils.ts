import { Point } from "./interfaces";

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
