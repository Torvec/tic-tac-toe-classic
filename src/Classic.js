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
    this.borderWidth = 2;
    this.bg;
    this.color;
    this.content;
    this.state = CELL.EMPTY;
  }
  isPointerOver(pointer) {
    return (
      pointer.x >= this.x &&
      pointer.x <= this.x + this.width &&
      pointer.y >= this.y &&
      pointer.y <= this.y + this.height
    );
  }
  setState(newState) {
    if (this.state === CELL.EMPTY) this.state = newState;
  }
  cellStates(stateName) {
    switch (stateName) {
      case CELL.EMPTY:
        this.borderColor = "black";
        this.bg = "lightgray";
        this.color = "";
        this.content = " ";
        break;
      case CELL.X:
        this.borderColor = "blue";
        this.bg = "darkblue";
        this.color = "lightblue";
        this.content = "X";
        break;
      case CELL.O:
        this.borderColor = "red";
        this.bg = "darkred";
        this.color = "pink";
        this.content = "O";
        break;
    }
    switch (this.grid.state) {
      case GRID.X:
        this.borderColor = "blue";
        this.bg = "darkblue";
        this.color = "lightblue";
        break;
      case GRID.O:
        this.borderColor = "red";
        this.bg = "darkred";
        this.color = "pink";
        break;
      case GRID.DRAW:
        this.borderColor = "black";
        this.bg = "darkgray";
        this.color = "lightgray";
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
    c.strokeRect(this.x, this.y, this.width, this.height);
    // Cell Background
    c.fillStyle = this.bg;
    c.fillRect(this.x, this.y, this.width, this.height);
    // Cell Content
    c.fillStyle = this.color;
    c.font = "bold 64px Monospace";
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
    this.gameOver = false;
    this.player = null;
    this.setCurrentPlayer();
    this.cells = [];
    this.createGrid();
    this.state = GRID.ACTIVE;
  }
  createGrid() {
    const padding = 10;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        this.cells.push(
          new Cell({
            grid: this,
            x: this.x + padding + (col * (this.width - 2 * padding)) / 3,
            y: this.y + padding + (row * (this.height - 2 * padding)) / 3,
            width: (this.width - 2 * padding) / 3,
            height: (this.height - 2 * padding) / 3,
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
        cell.isPointerOver(this.input.pointer) &&
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
    } else if (this.isGridDraw(this.cells)) {
      this.setState(GRID.DRAW);
      this.gameOver = true;
    }
  }
  displayCurrentPlayer(c, player) {
    c.save();
    c.textAlign = "center";
    c.textBaseline = "middle";
    // Player X
    c.fillStyle = player === PLAYER.X ? "blue" : "grey";
    c.font = "bold 64px Roboto Mono";
    c.fillText("X", this.x + 128, this.height * 0.2);
    c.font = "bold 32px Roboto Mono";
    c.fillText("Turn", this.x + 128, this.height * 0.25);
    // Player O
    c.fillStyle = player === PLAYER.O ? "maroon" : "grey";
    c.font = "bold 64px Roboto Mono";
    c.fillText("O", this.x + 640, this.height * 0.2);
    c.font = "bold 32px Roboto Mono";
    c.fillText("Turn", this.x + 640, this.height * 0.25);
    c.restore();
  }
  displayEndGameMessage({ c, winner, message }) {
    c.save();
    c.fillStyle = "white";
    c.shadowColor = "rgba(0, 0, 0, 0.5)";
    c.shadowBlur = 10;
    c.shadowOffsetX = 5;
    c.shadowOffsetY = 5;
    c.fillRect(
      0,
      this.game.height * 0.25 + this.game.height * 0.125,
      this.game.width,
      this.game.height * 0.25
    );
    if (winner === PLAYER.X) {
      c.fillStyle = "blue";
    } else if (winner === PLAYER.O) {
      c.fillStyle = "maroon";
    } else {
      c.fillStyle = "black";
    }
    c.font = "bold 96px Monospace";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(message, this.x + this.width * 0.5, this.y + this.height * 0.5);
    c.restore();
  }
  update() {
    this.cells.forEach((cell) => cell.update());
  }
  draw(c) {
    this.cells.forEach((cell) => cell.draw(c));
    this.displayCurrentPlayer(c, this.player);
    const { won, winner } = this.isGridWon(this.cells);
    if (won)
      this.displayEndGameMessage({
        c: c,
        winner: winner,
        message: winner + " has won!",
      });
    else if (this.isGridDraw(this.cells))
      this.displayEndGameMessage({ c: c, message: "It's a DRAW!" });
  }
}
