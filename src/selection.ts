import Tube from "./tube.js";
import Bubble from "./bubbles.js";

export default class Selection {
  bubble: Bubble;
  tube: Tube;
  oldY: number;

  constructor() {
    this.bubble = null;
    this.oldY = 0;
    this.tube = null;
  }
}