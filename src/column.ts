import * as Const from "./const.js";

export default class Column {
  maxBubbles: number;
  bubbleCount: number;
  bubbleIndex: number;
  colors: number[];

  constructor(blocks: number) {
    this.maxBubbles = blocks;
    this.bubbleCount = this.bubbleIndex = 0;
    this.colors = new Array(3);
    this.colors[0] = this.colors[1] = this.colors[2] = this.colors[3] = Const.EMPTY;
  }

  isFull(): Boolean {
    return this.bubbleCount === this.maxBubbles;
  }

  isEmpty(): Boolean {
    return this.bubbleCount === 0;
  }

  peek(): number {
    if (this.bubbleCount === 0) return Const.EMPTY;
    return this.colors[this.bubbleIndex - 1];
  }

  set(c: number): void {
    if (this.bubbleCount === this.maxBubbles) return;
    this.colors[this.bubbleIndex] = c;
    this.bubbleIndex++;
    this.bubbleCount++;
  }

  get(): number {
    if (this.bubbleCount === 0) return Const.EMPTY;
    this.bubbleIndex--;
    this.bubbleCount--;
    let c = this.colors[this.bubbleIndex];
    this.colors[this.bubbleIndex] = Const.EMPTY;
    return c;
  }

  getColor(i: number): number {
    if (i < this.maxBubbles) return this.colors[i];
    return Const.EMPTY;
  }

  copy(c: Column): void {
    this.maxBubbles = c.maxBubbles;
    this.bubbleIndex = c.bubbleIndex;
    this.bubbleCount = c.bubbleCount;
    for (let i = 0; i < 4; i++) {
      this.colors[i] = c.colors[i];
    }
  }

  sameColor(): boolean {
    if (this.isEmpty()) return false;
    const b = this.colors[0];
    for (let t = 1; t < this.colors.length; t++) {
      let c = this.colors[t];
      if (c > -1 && b !== c) return false;
    }
    return true;
  }

  getColors(): string {
    let s: string = "";
    for (let x: number = 0; x < this.maxBubbles; x++) {
      switch (this.colors[x]) {
        case Const.RED: s += 'R'; break;
        case Const.BLUE: s += 'B'; break;
        case Const.GREEN: s += 'G'; break;
        case Const.YELLOW: s += 'Y'; break;
        case Const.MAGENTA: s += 'M'; break;
        case Const.CYAN: s += 'C'; break;
        case Const.ORANGE: s += 'O'; break;
        case Const.POOL: s += 'P'; break;
        case Const.ROSE: s += 'S'; break;
        case Const.LILA: s += 'L'; break;
        case Const.BROWN: s += 'W'; break;
        case Const.EMPTY: s += 'E'; break;
        default: break;
      }
    }
    return s;
  }
}