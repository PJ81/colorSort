import State from "./state.js";
import Column from "./column.js";

export default class Solver {
  visited: string[];
  parents: State[];
  states: State[];
  maxBubbles: number;
  id: number;

  solve(cls: Column[]): number {
    this.visited = [];
    this.parents = [];
    this.states = [];
    this.id = 1;
    this.states.push(new State(cls, 0, this.id, 0));
    this.maxBubbles = cls[0].maxBubbles;
    return this.solveDFS();
  }

  solveDFS(): number {
    let st: State = null;
    let s = "";
    while (this.states.length) {
      st = this.states.pop();
      if (st.steps.length > 1000) return -1;
      s = this.getPuzzle(st.pz);
      if (this.isCompleted(s)) {
        if (st.steps.length > 30) {
          return st.steps.length;//this.traceBack();
        }
        return -1;
      }

      this.parents.push(st);
      if (this.visited.indexOf(s) === -1) {
        this.visited.push(s);
        st.getMoves();
        if (st.moves.length) this.createStates(st);
        if (this.states.length > 4000) break;
      }
    }
    return -1;
  }

  getPuzzle(pz: Column[]): string {
    let p: string = "";
    for (let t = 0; t < pz.length; t++) {
      p += pz[t].getColors();
    }
    return p;
  }

  isCompleted(s: string): Boolean {
    for (let i = 0; i < s.length; i += this.maxBubbles) {
      for (let j = i + 1; j < i + this.maxBubbles; j++) {
        if (s.charAt(i) != s.charAt(j)) return false;
      }
    }
    return true;
  }

  createStates(st: State): void {
    for (let t = 0; t < st.moves.length; t++) {
      let cols: Column[] = new Array();
      for (let i = 0; i < st.pz.length; i++) {
        let c: Column = new Column(0);
        c.copy(st.pz[i]);
        cols.push(c);
      }

      cols[st.moves[t].to].set(cols[st.moves[t].from].get());
      let s: State = new State(cols, st.level + 1, ++this.id, st.id);

      for (let i = 0; i < st.steps.length; i++) {
        s.steps.push(st.steps[i]);
      }
      s.steps.push(st.moves[t]);
      this.states.push(s);
    }
  }

  /*traceBack(): number {
    let st = this.states.pop();
    let steps = 0;
    while (true) {
      if (st.parentID === 0) break;
      st = this.parents.find((e) => e.id === st.parentID);
      steps++;
    }
    return steps;
  }*/
}