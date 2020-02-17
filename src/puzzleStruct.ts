import Column from "./column.js";

export default class PuzzleStruct {

  maxColors: number;
  maxBubbles: number;
  solutionLength: number;
  colors: number[];

  constructor(mb: number = 0, mc: number = 0, sl: number = 0, clrs: number[]) {
    this.maxBubbles = mb;
    this.maxColors = mc;
    this.solutionLength = sl;
    if (clrs) this.colors = [...clrs];
  }

  copy(p: PuzzleStruct): void {
    this.maxColors = p.maxColors;
    this.maxBubbles = p.maxBubbles;
    this.solutionLength = p.solutionLength;
    this.colors = [...p.colors];
  }
}