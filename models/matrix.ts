import { Cell, Direction, DOWN, LEFT, Point, RIGHT, UP } from "../interfaces";
import { getRandomPoint, pickRandomOne, toIdx, toRowCol } from "../utils";
import Model from "./index";
export class Matrix extends Model {
  m: Cell[];
  next: null;
  nextPos: Point = null;
  constructor() {
    super();
    this.init();
  }
  set(arr) {
    this.m = Array.from({ length: 16 }, () => ({ number: 0, score: 0 }));
    this.m.forEach((item, idx) => {
      const [row, col] = toRowCol(idx);
      item.number = arr[row][col];
    });
  }
  init() {
    this.m = Array.from({ length: 16 }, () => ({ number: 0, score: 0 }));
    for (let i = 0; i < 3; i++) {
      const point = getRandomPoint();
      const value = pickRandomOne([1, 2, 3]);
      this.mutate(point, { number: value });
    }
    this.emit("init");
    this.setScore();
    this.setNext();
  }
  setNextPos(direction) {
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
      this.nextPos = null;
    }
    this.nextPos = pickRandomOne(available);
  }
  addNext(direction) {
    this.nextPos ?? this.setNextPos(direction);
    if (this.nextPos == null) return false;
    this.mutate(this.nextPos, { number: this.next });
    this.emit("add", { nextPos: this.nextPos, number: this.next });
    this.setNext();
    this.nextPos = null;
    return true;
  }
  isFinished() {
    return (
      [UP, DOWN, LEFT, RIGHT]
        .map((direction) => this.getMoveableCellIndices(direction).length)
        .reduce((a, b) => a + b, 0) == 0
    );
  }
  setNext() {
    let pick = pickRandomOne([1, 2, 3]);
    if (pick == 1 || pick == 2) {
      const numOfOne = this.m.map((cell) => cell.number).filter((x) => x == 1)
        .length;
      const numOfTwo = this.m.map((cell) => cell.number).filter((x) => x == 2)
        .length;

      if (numOfOne > numOfTwo + 2) pick = 2;
      else if (numOfTwo > numOfOne + 2) pick = 1;
    }
    this.next = pick;
    this.emit("set-next", this.next);
  }
  getScore() {
    return this.m.map((x) => x.score).reduce((a, b) => a + b, 0) ?? 0;
  }
  setScore() {
    this.emit("set-score", this.getScore());
  }
  move(direction: Direction) {
    if (!direction) return;
    const merged = this.merge(direction);
    if (merged > 0) this.addNext(direction);
    this.emit("move");
  }
  merge(direction: Direction) {
    const [dx, dy] = direction;
    let cnt = 0;
    const merged = [];
    const indices = this.getMoveableCellIndices(direction);
    indices
      .map((idx) => toRowCol(idx))
      .forEach(([row, col]) => {
        const _x = row + dx,
          _y = col + dy;
        const oldCell = this.at([_x, _y]);
        const newCell = this.at([row, col]);
        if (oldCell.number != 0)
          merged.push({
            idx: toIdx([_x, _y]),
            row: _x,
            col: _y,
            before: oldCell.number,
            after: newCell.number + oldCell.number,
          });
        this.mutate([_x, _y], {
          number: oldCell.number + newCell.number,
          score: oldCell.score + newCell.score + 2,
        });
        this.mutate([row, col], {
          number: 0,
          score: 1,
        });
        cnt += 1;
      });
    this.emit("merge", merged);
    if (cnt > 0) this.setScore();
    return cnt;
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
