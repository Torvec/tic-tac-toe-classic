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
    this.x = 16;
    this.y = 32;
    this.width = this.game.width - 32;
    this.height = this.game.height - 64;
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
      if (cell.isPointerOver(this.input.pointer) && cell.state === CELL.EMPTY) {
        cell.setState(CELL[this.player]);
        this.handleGridStateChange();
        if (this.gameOver) return;
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
    return { wond: false, winner: null };
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
    c.fillStyle = "white";
    c.font = "bold 32px Monospace";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("It is " + player + "'s Turn", this.width * 0.5, 32);
    c.restore();
  }
  displayWinMessage(c, winner) {
    c.save();
    c.fillStyle = "white";
    c.fillRect(
      0,
      this.y + this.height * 0.333,
      this.width + 32,
      this.height * 0.333
    );
    c.fillStyle = "purple";
    c.font = "bold 128px Monospace";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(
      winner + " has won!",
      this.x + this.width * 0.5,
      this.y + this.height * 0.5
    );
    c.restore();
  }
  displayDrawMessage(c) {
    c.save();
    c.fillStyle = "white";
    c.fillRect(
      0,
      this.y + this.height * 0.333,
      this.width + 32,
      this.height * 0.333
    );
    c.fillStyle = "black";
    c.font = "bold 128px Monospace";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(
      "The Game is a Draw!",
      this.x + this.width * 0.5,
      this.y + this.height * 0.5
    );
    c.restore();
  }
  update() {
    this.cells.forEach((cell) => cell.update());
  }
  draw(c) {
    this.cells.forEach((cell) => cell.draw(c));
    this.displayCurrentPlayer(c, this.player);
    const { won, winner } = this.isGridWon(this.cells);
    if (won) this.displayWinMessage(c, winner);
    else if (this.isGridDraw(this.cells)) this.displayDrawMessage(c);
  }
}