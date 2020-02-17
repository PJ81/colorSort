import Move from "./move.js";

export default class UndoMove {
  undo: Move[];

  constructor() {
    this.clear();
  }

  UndoMove(): void {
    this.clear();
  }

  push(m: Move): void {
    this.undo.push(m);
  }

  clear(): void {
    this.undo = [];
  }

  pop(): Move {
    if (this.undo.length === 0) return null;
    const m = this.undo.pop();
    return m;
  }
}