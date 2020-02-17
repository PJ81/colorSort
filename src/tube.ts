import Point from "./point.js";
import Bubble from "./bubbles.js";

export default class Tube {
  column: Bubble[];
  img: HTMLImageElement;
  pos: Point;
  index: number;
  maxBubbles: number;
  rect: Point[];

  addBubble: (bubble: Bubble) => void;
  inRect: (pt: Point) => boolean;
  isEmpty: () => boolean;
  height: () => number;
  count: () => number;

  constructor(mx: number, img: HTMLImageElement, pos: Point, index: number) {
    this.pos = new Point(pos.x, pos.y);
    this.img = img;
    this.column = [];
    this.maxBubbles = mx;
    this.index = index;

    this.rect = [];
    this.rect.push(new Point(pos.x, pos.y));
    this.rect.push(new Point(pos.x + img.width, pos.y + img.height));

    this.height = () => this.img.height;
    this.count = () => this.column.length;
    this.isEmpty = () => this.column.length < 1;
    this.addBubble = (bubble: Bubble) => { this.column.push(bubble); }
    this.inRect = (pt: Point): boolean => { return pt.x >= this.rect[0].x && pt.y >= this.rect[0].y && pt.x <= this.rect[1].x && pt.y <= this.rect[1].y; }
  }

  sameColor(): boolean {
    if (this.isEmpty()) return true;
    if (this.column.length < this.maxBubbles) return false;

    const b = this.column[0];
    for (let t = 1; t < this.column.length; t++) {
      let c = this.column[t].color;
      if (c > -1 && b.color !== c) return false;
    }
    return true;
  }

  removeBubble(bb: Bubble) {
    for (let z = this.column.length - 1, b = z; b >= 0; b--)
      if (this.column[b] === bb) {
        this.column.splice(b, 1);
        return
      }
  }

  peek(): number {
    if (this.column.length < 1) return null;
    return this.column[this.column.length - 1].color;
  }

  isFull(): boolean {
    return this.column.length === this.maxBubbles;
  }

  getBubble(): Bubble {
    return this.column[this.column.length - 1];
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.img, this.pos.x, this.pos.y);
    this.column.forEach(bubble => {
      bubble.draw(ctx);
    });
  }

  update(dt: number) {
    this.column.forEach(bubble => {
      bubble.update(dt);
    });
  }
}