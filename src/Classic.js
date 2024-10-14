import { RoundedRect, EndGameMessage, CurrentPlayerSign } from "./UI.js";

const PLAYER = {
  X: "X",
  O: "O",
};

const CELL = {
  EMPTY: " ",
  X: PLAYER.X,
  O: PLAYER.O,
};

const GRID = {
  ACTIVE: "active",
  X: PLAYER.X,
  O: PLAYER.O,
  DRAW: "draw",
};

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

class Cell {
  constructor({ grid, x, y, width, height }) {
    this.grid = grid;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.borderColor;
    this.borderWidth = 4;
    this.bg;
    this.color;
    this.content;
    this.state = CELL.EMPTY;
    this.roundedRect = new RoundedRect(this.grid.game);
  }
  setState(newState) {
    if (this.state === CELL.EMPTY) this.state = newState;
  }
  cellStates(stateName) {
    switch (stateName) {
      case CELL.EMPTY:
        this.borderColor = "white";
        this.bg = "lightgray";
        this.color = "";
        this.content = " ";
        break;
      case CELL.X:
        this.borderColor = "#99A3FF";
        this.bg = "#0A1DC2";
        this.color = "#99A3FF";
        this.content = "X";
        break;
      case CELL.O:
        this.borderColor = "#FFCCCC";
        this.bg = "#C20A0A";
        this.color = "#FFCCCC";
        this.content = "O";
        break;
    }
    switch (this.grid.state) {
      case GRID.X:
        this.borderColor = "rgba(10, 29, 194, 0.2)";
        this.bg = "#99A3FF";
        this.color = "rgba(10, 29, 194, 0.2)";
        break;
      case GRID.O:
        this.borderColor = "rgba(194, 10, 10, 0.2)";
        this.bg = "#FFCCCC";
        this.color = "rgba(194, 10, 10, 0.2)";
        break;
      case GRID.DRAW:
        this.borderColor = "#999999";
        this.bg = "#AAAAAA";
        this.color = "#999999";
        break;
    }
  }
  update() {
    this.cellStates(this.state);
  }
  draw(c) {
    c.save();
    // Cell Border
    c.strokeStyle = this.borderColor;
    c.lineWidth = this.borderWidth;
    this.roundedRect.draw({
      c: c,
      x: this.x + 8,
      y: this.y + 8,
      width: this.width - 16,
      height: this.height - 16,
      radius: 20,
      stroke: true,
    });
    // Cell Background
    c.fillStyle = this.bg;
    this.roundedRect.draw({
      c: c,
      x: this.x + 8,
      y: this.y + 8,
      width: this.width - 16,
      height: this.height - 16,
      radius: 20,
      fill: true,
    });
    // Cell Content
    c.fillStyle = this.color;
    c.font = "bold 128px Roboto Mono";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(
      this.state,
      this.x + this.width * 0.5,
      this.y + this.height * 0.5
    );
    c.restore();
  }
}

export class Grid {
  constructor(game) {
    this.game = game;
    this.input = this.game.input;
    this.width = 768;
    this.height = 768;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height * 0.5 - this.width * 0.5;
    this.init();
  }
  init() {
    this.gameOver = false;
    this.player = null;
    this.setCurrentPlayer();
    this.currentPlayerSign = new CurrentPlayerSign(this.game);
    this.cells = [];
    this.createGrid();
    this.state = GRID.ACTIVE;
    this.endGameMessage = new EndGameMessage(this.game);
  }
  createGrid() {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        this.cells.push(
          new Cell({
            grid: this,
            x: this.x + (col * this.width) / 3,
            y: this.y + (row * this.height) / 3,
            width: this.width / 3,
            height: this.height / 3,
          })
        );
      }
    }
  }
  setState(newState) {
    this.state = newState;
  }
  setCurrentPlayer() {
    if (this.player === null)
      this.player = Math.random() <= 0.5 ? PLAYER.X : PLAYER.O;
    else if (this.player === PLAYER.X) this.player = PLAYER.O;
    else if (this.player === PLAYER.O) this.player = PLAYER.X;
  }
  handleClick() {
    this.cells.forEach((cell) => {
      if (
        this.input.isPointerOver(this.input.pointer, cell) &&
        cell.state === CELL.EMPTY &&
        !this.gameOver
      ) {
        cell.setState(CELL[this.player]);
        this.handleGridStateChange();
        this.setCurrentPlayer();
      }
    });
  }
  isGridWon(cell) {
    for (let combination of WINNING_COMBOS) {
      const [a, b, c] = combination;
      const cellA = cell[a].state;
      const cellB = cell[b].state;
      const cellC = cell[c].state;
      if (cellA === cellB && cellB === cellC && cellA !== CELL.EMPTY) {
        return { won: true, winner: cellA };
      }
    }
    return { won: false, winner: null };
  }
  isGridDraw(cells) {
    return cells.every((cell) => cell.state !== CELL.EMPTY);
  }
  handleGridStateChange() {
    const { won, winner } = this.isGridWon(this.cells);
    if (won) {
      this.setState(GRID[winner]);
      this.gameOver = true;
      this.handleReplayCountdown();
    } else if (this.isGridDraw(this.cells)) {
      this.setState(GRID.DRAW);
      this.gameOver = true;
      this.handleReplayCountdown();
    }
  }
  handleReplayCountdown() {
    if (this.gameOver) {
      let countdown = 3;
      const interval = setInterval(() => {
        countdown--;
        if (countdown < 0) {
          clearInterval(interval);
          this.init();
        }
      }, 1000);
    }
  }
  update() {
    this.cells.forEach((cell) => cell.update());
  }
  draw(c) {
    this.currentPlayerSign.draw({
      c: c,
      player: this.player,
      x_Xpos: this.x + 96,
      o_Xpos: this.x + 608,
      y: this.height * 0.15,
    });
    this.cells.forEach((cell) => cell.draw(c));
    const { won, winner } = this.isGridWon(this.cells);
    if (won) {
      this.endGameMessage.draw({
        c: c,
        winner: winner,
        message: winner + " Wins!",
        x: this.x + this.width * 0.5,
        y: this.y + this.height * 0.5,
      });
    } else if (this.isGridDraw(this.cells)) {
      this.endGameMessage.draw({
        c: c,
        message: "DRAW!",
        x: this.x + this.width * 0.5,
        y: this.y + this.height * 0.5,
      });
    }
  }
}
