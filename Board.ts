interface IEvent {
  type: string;
  handler: Function;
}

type Point = [number, number];

interface ICell {
  number: number;
  score: number;
}

class Model {
  observers: Set<IEvent> = new Set();
  on(type: string, handler: Function) {
    this.observers.add({
      type,
      handler,
    });
  }
  off(type: string) {
    Array.from(this.observers)
      .filter((x) => x.type === type)
      .forEach((item: IEvent) => {
        this.observers.delete(item);
      });
  }
  emit(type: string, payload = undefined) {
    Array.from(this.observers)
      .filter((x) => x.type === type)
      .forEach((observer) => {
        observer.handler(payload);
      });
  }
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
class Matrix extends Model {
  m: Array<Array<ICell>>;
  constructor() {
    super();
    this.m = Array.from({ length: 4 }, () =>
      new Array(4).fill({ number: 0, score: 0 })
    );
  }
  add(p: Point) {
    const value = getOneOrTwo();
    this.emit("pop");
  }
  move(direction) {}
}

export default class Board {
  $: HTMLDivElement;
  model: Model;
  constructor() {
    this.$ = document.getElementById("board") as HTMLDivElement;
    this.render();
  }
  render() {
    for (let i = 0; i < 16; i++) {}
  }
}
