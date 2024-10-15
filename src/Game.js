import { InputHandler } from "./InputHandler.js";
import { Grid } from "./Classic.js";

export class Game {
  constructor() {
    this.width = canvas.width;
    this.height = canvas.height;
    this.input = new InputHandler({
      game: this,
      canvas: canvas,
    });
    this.grid = new Grid(this);
  }
  render(c) {
    this.grid.update(c);
    this.grid.draw(c);
  }
}

const canvas = document.getElementById("gameCanvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = Math.max(320, Math.min(window.innerWidth + 256, 928));

const game = new Game();

function animationLoop() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  game.render(c);
  requestAnimationFrame(animationLoop);
}
requestAnimationFrame(animationLoop);
