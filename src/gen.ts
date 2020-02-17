import Creator from "./puzzleGen.js";

onmessage = (e) => {
  postMessage(new Creator().createPuzzle(e.data));
}