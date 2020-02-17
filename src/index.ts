import Game from "./game.js";
import Sound from "./sound.js";
import PuzzleStruct from "./puzzleStruct.js";
import Tube from "./tube.js";
import Point from "./point.js";
import Bubbles from "./bubbles.js";
import Selection from "./selection.js";
import UndoMove from "./undo.js";
import Move from "./move.js";

class Sort extends Game {
  sound: any;
  actualPz: PuzzleStruct;
  nextPz: PuzzleStruct;
  built: boolean;
  tubes: Tube[];
  selection: Selection;
  moveCounter: number;
  undo: UndoMove;

  constructor() {
    super();
    this.undo = new UndoMove();
    this.tubes = [];
    this.actualPz = new PuzzleStruct(0, 0, 0, null);
    this.nextPz = new PuzzleStruct(0, 0, 0, null);
    this.built = false;
    this.selection = new Selection();
    this.moveCounter = 0;

    document.getElementById("undo").addEventListener("mousedown", () => this.undoMove());
    document.getElementById("reset").addEventListener("mousedown", () => this.restart());

    this.canvas.addEventListener("click", (ev: MouseEvent) => this.click(null, ev));
    this.canvas.addEventListener("touchstart", (ev: TouchEvent) => this.click(ev, null));

    this.sound = new Sound([
      "./snd/blop.mp3", "./snd/clank.mp3", "./snd/click.mp3", "./snd/complete.mp3"
    ]);

    this.res.loadImages(["00.png", "01.png", "02.png", "03.png", "04.png", "05.png", "06.png",
      "07.png", "08.png", "09.png", "10.png", "short.png", "long.png"], () => {
        const myWorker: Worker = new Worker("./dist/gen.js", { type: 'module' });
        myWorker.onmessage = (p) => {
          let pz = p.data as PuzzleStruct;
          this.actualPz = new PuzzleStruct(pz.maxBubbles, pz.maxColors, pz.solutionLength, pz.colors);
          myWorker.terminate();
          this.createPuzzle();
          this.loop();
        }
        myWorker.postMessage(true);
      });
  }

  restart(): void {
    let m = this.undo.pop();
    if (m == null) return;

    if (this.selection.bubble) this.selection.bubble.pos.y = this.selection.oldY;
    while (m != null) {
      this.selection.tube = this.tubes[m.newTubeIndex];
      this.selection.bubble = this.selection.tube.getBubble();
      this.drop(this.tubes[m.oldTubeIndex], false);
      m = this.undo.pop();
    }
  }

  undoMove(): void {
    let m: Move = this.undo.pop();
    if (m == null) return;

    if (this.selection.bubble) this.selection.bubble.pos.y = this.selection.oldY;
    this.selection.tube = this.tubes[m.newTubeIndex];
    this.selection.bubble = this.selection.tube.getBubble();
    this.drop(this.tubes[m.oldTubeIndex], false);
  }

  check(): boolean {
    if (this.selection.bubble) return false;
    for (let t = 0; t < this.tubes.length; t++) {
      if (!this.tubes[t].sameColor()) return false;
    }
    return true;
  }

  tryDrop(tube: Tube): boolean {
    if (tube === this.selection.tube || !tube.isFull() && this.selection.tube.peek() === tube.peek()) {
      this.drop(tube);
      return true;
    }
    return false;
  }

  drop(tube: Tube, saveUndo: Boolean = true) {
    if (saveUndo && tube != this.selection.tube)
      this.undo.push(new Move(tube.index, this.selection.tube.index));

    this.selection.tube.removeBubble(this.selection.bubble);
    tube.addBubble(this.selection.bubble);

    const topPos = 50 + (this.actualPz.maxBubbles === 3 ? 34 : 0);
    const j = tube.count();
    this.selection.bubble.pos.x = tube.pos.x + 6;
    this.selection.bubble.pos.y = topPos + tube.height() - (3 + this.selection.bubble.height() * j + j * 2);
    this.selection.tube = null;
    this.selection.bubble = null;
    this.moveCounter--;
    if (this.moveCounter < 0) this.ctx.fillStyle = "#f00";
    //sound.clank();

    if (this.check()) {
      //sound.complete();
      //btns.play.visible = true;
      this.actualPz.copy(this.nextPz);
      this.createPuzzle();
    }
  }

  click(tev: TouchEvent, mev: MouseEvent) {
    const pt = new Point();
    if (tev) {
      pt.set(tev.touches[0].clientX - (tev.srcElement as HTMLCanvasElement).offsetLeft, tev.touches[0].clientY - (tev.srcElement as HTMLCanvasElement).offsetTop);
      tev.preventDefault();
    } else {
      pt.set(mev.clientX - (mev.srcElement as HTMLCanvasElement).offsetLeft, mev.clientY - (mev.srcElement as HTMLCanvasElement).offsetTop);
      mev.preventDefault();
    }

    let t = 0
    for (; t < this.tubes.length; t++) {
      if (this.tubes[t].inRect(pt)) break;
    }

    if (t < this.tubes.length) {
      const tube = this.tubes[t];
      if (!this.selection.bubble && tube.isEmpty()) return;
      if (tube.isEmpty() && this.selection.bubble) {
        this.drop(tube);
      } else {
        if (this.selection.bubble) {
          this.selection.bubble.pos.y = this.selection.oldY;
          if (this.tryDrop(tube)) return;
        }
        this.selection.bubble = tube.getBubble();
        this.selection.tube = tube;
        this.selection.oldY = this.selection.bubble.pos.y;
        this.selection.bubble.pos.y = tube.pos.y - 16;
        //sound.blop();
      }
    }
  }

  buildPuzzle() {
    this.built = false;
    this.moveCounter = this.actualPz.solutionLength;
    this.tubes = [];
    let cn = 0, x = 0;
    const pw = ((this.actualPz.maxColors + (this.actualPz.maxBubbles === 3 ? 1 : 2)) * this.res.images[11].width + 10 * (this.actualPz.maxColors)) / 2;
    const ox = this.canvas.width / 2 - pw;
    const topPos = 50 + (this.actualPz.maxBubbles === 3 ? 34 : 0);
    const pt = new Point(0, topPos), bp = new Point();

    for (; x < this.actualPz.maxColors; x++) {
      pt.x = 10 * x + this.res.images[11].width * x + ox;
      const tube = new Tube(this.actualPz.maxBubbles, this.actualPz.maxBubbles == 3 ? this.res.images[11] : this.res.images[12], pt, x);

      for (let z = 0; z < this.actualPz.maxBubbles; z++) {
        const c = this.actualPz.colors[z + cn];
        if (c < 0) continue;
        const j = z + 1;
        bp.set(pt.x + 6, topPos + tube.height() - (3 + this.res.images[0].height * j + j * 2));
        const bb = new Bubbles(this.res.images[c], c, bp);
        tube.addBubble(bb);
      }
      cn += this.actualPz.maxBubbles;
      this.tubes.push(tube);
    }

    pt.x = 10 * x + this.res.images[11].width * x + ox;
    this.tubes.push(new Tube(this.actualPz.maxBubbles, this.actualPz.maxBubbles == 3 ? this.res.images[11] : this.res.images[12], pt, x));

    if (this.actualPz.maxBubbles === 4) {
      x++;
      pt.x = 10 * x + this.res.images[11].width * x + ox;
      this.tubes.push(new Tube(this.actualPz.maxBubbles, this.res.images[12], pt, x));
    }
  }

  update(dt: number) {
    if (this.built) this.buildPuzzle();
    this.tubes.forEach(tube => {
      tube.update(dt);
    });
  }

  draw() {
    this.tubes.forEach(tube => {
      tube.draw(this.ctx);
    });
  }

  createPuzzle(): void {
    this.built = true;
    this.undo.clear();
    const myWorker: Worker = new Worker("./dist/gen.js", { type: 'module' });
    myWorker.onmessage = (p) => {
      let pz = p.data as PuzzleStruct;
      this.nextPz = new PuzzleStruct(pz.maxBubbles, pz.maxColors, pz.solutionLength, pz.colors);
      myWorker.terminate();
    }
    myWorker.postMessage(false);
  }
}

if (window.Worker) new Sort()
else console.log("WORKERS ARE NOT AVAILABLE!!!");
