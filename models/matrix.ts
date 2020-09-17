import { Cell, Direction, Point } from "../interfaces";
import Model from "./index";
export class Matrix extends Model {
  m: Cell[];
  constructor() {
    super();
    this.m = Array.from({ length: 16 }, () => ({ number: 0, score: 0 }));
    this.emit("init");
  }
  add() {
    const point = getRandomPoint();
    const value = getOneOrTwo();
    this.mutate(point, { number: value });
    this.emit("add");
  }
  move(direction: Direction) {}
  mutate(point: Point, value: Partial<Cell>) {
    const idx = toIdx(point);
    this.m = Object.assign([], this.m, {
      [idx]: { ...this.at(idx), ...value },
    });
  }
  at(param: number | Point) {
    const idx = typeof param == "number" ? param : toIdx(param);
    return this.m[idx];
  }
  getMoveableCellIndices(direction: Direction) {
    const [dx, dy] = direction;
    const indices: number[] = [];
    this.iterate(([row, col, idx, cell]) => {
      const _x = dx + row,
        _y = dy + col;
      if (this.at(idx).number == 0) return;
      if (_x < 0 || _x > 3 || _y < 0 || _y > 3) return;

      if (isMergable(this.at(idx).number, this.at([_x, _y]).number))
        indices.push(idx);
    });
    return indices;
  }
  iterate(callback) {
    this.m.forEach((cell, idx) => {
      callback([...toRowCol(idx), idx, cell]);
    });
  }
}

function isMergable(a: number, b: number) {
  if (a == 0 || b == 0) return true;
  if (a != b && a + b == 3) return true;
  if (a == b && a + b != 2 && a + b != 4) return true;
  return false;
}
function getRandomInt(max: number = 1) {
  return Math.floor(Math.random() * max);
}
function getOneOrTwo() {
  return getRandomInt(2) + 1;
}
function getRandomPoint(): Point {
  return [getRandomInt(4), getRandomInt(4)];
}
function toRowCol(idx): Point {
  return [Math.floor(idx / 4), idx % 4];
}
function toIdx([row, col]: Point) {
  return row * 4 + col;
}
