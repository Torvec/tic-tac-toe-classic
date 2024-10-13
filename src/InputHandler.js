export class InputHandler {
  constructor({ game, canvas }) {
    this.game = game;
    this.canvas = canvas;
    this.pointer = {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    };
    this.canvas.addEventListener("click", (e) => this.handleClickEvent(e));
    this.canvas.addEventListener("touchstart", (e) =>
      this.handleTouchStartEvent(e)
    );
  }
  handleClickEvent(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = e.clientX - rect.left;
    this.pointer.y = e.clientY - rect.top;
    this.game.grid.handleClick(this.pointer);
    // this.game.grid.handleReplay(this.pointer);
  }
  handleTouchStartEvent(e) {
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    this.pointer.x = touch.clientX - rect.left;
    this.pointer.y = touch.clientY - rect.top;
    this.game.grid.handleClick(this.pointer);
    // this.game.grid.handleReplay(this.pointer);
  }
}
