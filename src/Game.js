import { InputHandler } from "./InputHandler.js";
import { Header, Footer } from "./UI.js";
import { Grid } from "./Classic.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.input = new InputHandler({
      game: this,
      canvas: this.canvas,
    });
    this.header = new Header(this);
    this.grid = new Grid(this);
    this.footer = new Footer(this);
  }
  render(c) {
    this.header.logo(c);
    this.grid.update(c);
    this.grid.draw(c);
    this.footer.draw(c);
  }
}
