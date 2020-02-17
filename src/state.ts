import * as Const from "./const.js";
import Column from "./column.js";

class BubbleMove {
  from: number;
  to: number;

  constructor(f: number = -1, t: number = -1) {
    this.from = f;
    this.to = t;
  }
}

export default class State {
  id: number;
  parentID: number;
  moves: BubbleMove[];
  steps: BubbleMove[];
  pz: Column[];
  level: number;

  constructor(cols: Column[], l: number, id: number, parent: number) {
    this.pz = new Array();
    this.moves = new Array();
    this.steps = new Array();
    this.level = l;
    this.id = id;
    this.parentID = parent;


    for (let i: number = 0; i < cols.length; i++) {
      let c: Column = new Column(0);
      c.copy(cols[i]);
      this.pz.push(c);
    }
  }

  getMoves(): void {
    let target: number[] = new Array();
    for (let i = 0; i < this.pz.length; i++) {
      if (this.pz[i].isEmpty() || !this.pz[i].isFull()) {
        target.push(i);
      }
    }
    let a: number;
    for (let i = 0; i < this.pz.length; i++) {
      a = this.pz[i].peek();
      if (a != Const.EMPTY) {
        for (let t: number = 0; t < target.length; t++) {
          if (this.pz[target[t]].isEmpty()) {
            this.moves.push(new BubbleMove(i, target[t]));
          } else {
            if (a == this.pz[target[t]].peek()) {
              this.moves.push(new BubbleMove(i, target[t]));
            }
          }
        }
      }
    }
  }
}