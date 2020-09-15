import { ThreeEvent } from "../interfaces";

class Model {
  observers: Set<ThreeEvent> = new Set();
  on(type: string, handler: Function) {
    this.observers.add({
      type,
      handler,
    });
  }
  off(type: string) {
    Array.from(this.observers)
      .filter((x) => x.type === type)
      .forEach((item: ThreeEvent) => {
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

export default Model;
