export default class Move {
  newTubeIndex: number;
  oldTubeIndex: number;


  constructor(nIndex: number = -1, oIndex: number = -1) {
    this.newTubeIndex = nIndex;
    this.oldTubeIndex = oIndex;
  }
}