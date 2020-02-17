import Column from "./column.js";
import Solver from "./solver.js";
import PuzzleStruct from "./puzzleStruct.js";


export default class Creator {
  columns: Column[];

  build(maxBubbles: number, maxColors: number, shuffle: number): PuzzleStruct {
    const s = new Solver()
    while (true) {
      this.columns = [];

      for (let x = 0; x < maxColors; x++) {
        let c: Column = new Column(maxBubbles);
        for (let z = 0; z < maxBubbles; z++) {
          c.set(x);
        }
        this.columns.push(c);
      }
      this.columns.push(new Column(maxBubbles));
      if (maxBubbles == 4) this.columns.push(new Column(maxBubbles));
      //this.mix(shuffle);


      let z = true;
      while (z) {
        this.mix(shuffle);
        z = false;
        for (let r = 0; r < this.columns.length; r++) {
          if (this.columns[r].sameColor()) {
            z = true;
            break;
          }
        }
      }

      let sl = s.solve(this.columns);
      if (sl > -1) {
        const tmp = [];
        for (let i = 0; i < this.columns.length; i++) {
          for (let j = 0; j < maxBubbles; j++) {
            tmp.push(this.columns[i].getColor(j));
          }
        }
        return new PuzzleStruct(maxBubbles, maxColors, sl, tmp);
      }
    }
  }

  mix(shuffle: number): void {
    let maxBub: number = this.columns[0].maxBubbles,
      empCnt: number = maxBub === 4 ? 2 : 1,
      colCnt: number = this.columns.length - empCnt, i: number, a: number;

    for (let d = 0; d < shuffle; d++) {
      for (let e = 0; e < empCnt; e++) {
        for (let b = 0; b < maxBub; b++) {
          do {
            i = Math.floor(Math.random() * colCnt);
            //i = this.rnd.rndI(0, colCnt);
          } while (this.columns[i].isEmpty());
          a = this.columns[i].get();
          this.columns[colCnt + e].set(a);
        }
      }

      for (let e = 0; e < empCnt; e++) {
        for (let b = 0; b < maxBub; b++) {
          a = this.columns[colCnt + e].get();
          while (true) {
            i = Math.floor(Math.random() * colCnt);
            //i = this.rnd.rndI(0, colCnt);
            if (!this.columns[i].isFull()) {
              this.columns[i].set(a);
              break;
            }
          }
        }
      }
    }
  }

  createPuzzle(simple: boolean) {
    let bubbles: number, columns: number, shuffle: number;
    if (simple) {
      bubbles = 3;
      columns = Math.floor(Math.random() * 5) + 6;
      shuffle = 900;
    } else {
      bubbles = Math.random() > .5 ? 4 : 3;
      columns = Math.floor(Math.random() * 5) + 6;
      shuffle = 1800;
    }
    return this.build(bubbles, columns, shuffle);
  }
}