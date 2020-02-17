import Point from "./point.js";

export default class Bubble {
  img: HTMLImageElement;
  pos: Point;
  color: number;
  height: () => number;

  constructor(img: HTMLImageElement, color: number, pos: Point) {
    this.img = img;
    this.color = color;
    this.pos = new Point(pos.x, pos.y);
    this.height = () => this.img.height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.img, this.pos.x, this.pos.y);
  }

  update(dt: number) {
    //
  }
}