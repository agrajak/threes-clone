import { Cell, Direction, DOWN, LEFT, Point, RIGHT, UP } from "../interfaces";
import Model from "./index";
export class Matrix extends Model {
  m: Cell[];
  constructor() {
    super();
    this.m = Array.from({ length: 16 }, () => ({ number: 0, score: 0 }));
    this.emit("init");
  }
  init() {
    this.m = Array.from({ length: 16 }, () => ({ number: 0, score: 0 }));
    for (let i = 0; i < 3; i++) {
      const point = getRandomPoint();
      const value = getOneOrTwo();
      this.mutate(point, { number: value });
    }
    this.emit("add");
  }
  add(direction) {
    let col = -1,
      row = -1;
    const available = [];
    const isVertical = direction == LEFT || direction == RIGHT;
    if (isVertical) {
      if (direction == LEFT) col = 3;
      else if (direction == RIGHT) col = 0;
      for (let row = 0; row < 4; row++) {
        if (this.at([row, col]).number == 0) {
          available.push([row, col]);
        }
      }
    } else {
      if (direction == UP) row = 3;
      else if (direction == DOWN) row = 0;
      for (let col = 0; col < 4; col++) {
        if (this.at([row, col]).number == 0) {
          available.push([row, col]);
        }
      }
    }

    if (available.length == 0) {
      return false;
    }
    this.mutate(pickRandomOne(available), { number: pickRandomOne([1, 2, 3]) });
    this.emit("add");
    return true;
  }
  merge(direction: Direction) {
    const [dx, dy] = direction;
    const indices = this.getMoveableCellIndices(direction);
    indices
      .map((idx) => toRowCol(idx))
      .forEach(([row, col]) => {
        const _x = row + dx,
          _y = col + dy;
        const oldCell = this.at([_x, _y]);
        const newCell = this.at([row, col]);
        this.mutate([_x, _y], {
          number: oldCell.number + newCell.number,
          score: oldCell.score + newCell.score,
        });
        this.mutate([row, col], {
          number: 0,
          score: 1,
        });
      });
    this.emit("merge");
  }
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
    if (!direction) return [];
    const [dx, dy] = direction;
    const indices: number[] = [];

    let isVertical = direction == LEFT || direction == RIGHT;
    let row = 0,
      col = 0;

    if (direction == LEFT) col = 1;
    else if (direction == RIGHT) col = 2;
    else if (direction == UP) row = 1;
    else if (direction == DOWN) row = 2;

    for (let i = 0; i < 12; i++) {
      const _x = dx + row,
        _y = dy + col;
      if (
        (isMergable(this.at([_x, _y]).number, this.at([row, col]).number) ||
          indices.indexOf(toIdx([_x, _y])) != -1) &&
        this.at([row, col]).number != 0
      ) {
        indices.push(toIdx([row, col]));
      }
      if (isVertical) {
        if (i % 4 == 3) {
          col -= dy;
        }
        row = (row + 1) % 4;
      } else {
        if (i % 4 == 3) {
          row -= dx;
        }
        col = (col + 1) % 4;
      }
    }
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
function pickRandomOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
