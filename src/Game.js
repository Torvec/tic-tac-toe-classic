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
    this.gameLogo = new Image();
    this.gameLogo.src = "./assets/game_logo.png";
    this.myLogo = new Image();
    this.myLogo.src = "./assets/logo_bo.png";
    this.grid = new Grid(this);
  }
  handlePointerEvent(pointer) {
    this.grid.handleClick(pointer);
  }
  header(c) {
    c.drawImage(
      this.gameLogo,
      this.width * 0.5 - 50,
      this.height * 0.075,
      100,
      118
    );
  }
  footer(c) {
    c.drawImage(this.myLogo, this.width * 0.4 - 24, this.height - 128, 48, 48);
    c.save();
    c.fillStyle = "black";
    c.textAlign = "left";
    c.textBaseline = "middle";
    c.font = "24px Roboto";
    c.fillText("2024 Edward Vonschondorf", this.width * 0.425, this.height - 120);
    c.fillStyle = "#C76E00";
    c.fillText("edward-vonschondorf.dev", this.width * 0.425, this.height - 88);
    c.restore();
  }
  render(c) {
    this.header(c);
    this.grid.update(c);
    this.grid.draw(c);
    this.footer(c);
  }
}
