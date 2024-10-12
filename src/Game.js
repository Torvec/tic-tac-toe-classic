import { InputHandler } from "./InputHandler.js";
import { Grid } from "./Classic.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.input = new InputHandler({
      game: this,
      canvas: this.canvas,
      onPointerEvent: (pointer) => {
        this.handlePointerEvent(pointer);
      },
    });
    this.grid = new Grid(this);
  }
  handlePointerEvent(pointer) {
    this.grid.handleClick(pointer);
  }
  render(c) {
    this.grid.update(c);
    this.grid.draw(c);
  }
}
