class UI {
  constructor(game) {
    this.game = game;
    this.width = this.game.width;
    this.height = this.game.height;
  }
}

export class RoundedRect extends UI {
  constructor(game) {
    super(game);
  }
  draw({ c, x, y, width, height, radius, fill, stroke }) {
    c.save();
    c.beginPath();
    c.moveTo(x + radius, y);
    c.arcTo(x + width, y, x + width, y + height, radius);
    c.arcTo(x + width, y + height, x, y + height, radius);
    c.arcTo(x, y + height, x, y, radius);
    c.arcTo(x, y, x + width, y, radius);
    c.closePath();
    if (fill) c.fill();
    if (stroke) c.stroke();
    c.restore();
  }
}

export class CurrentPlayerSign extends UI {
  constructor(game) {
    super(game);
    this.width = Math.max(320, Math.min(this.game.width, 768));
    this.height = 160;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = 0;
    this.xTurnImg = new Image();
    this.xTurnImg.src = "./assets/x_turn.png";
    this.oTurnImg = new Image();
    this.oTurnImg.src = "./assets/o_turn.png";
  }
  draw(c, player) {
    c.save();
    c.globalAlpha = player === "X" ? 1 : 0.2;
    c.drawImage(this.xTurnImg, this.x + 64, this.y + 45, 54, 89);
    c.globalAlpha = player === "O" ? 1 : 0.2;
    c.drawImage(this.oTurnImg, this.x + this.width - 128, this.y + 45, 64, 89);
    c.restore();
  }
}

export class EndGameMessage extends UI {
  constructor(game) {
    super(game);
    this.x = this.width / 2;
    this.y = this.height / 2;
  }
  draw(c, winner) {
    let message = "";
    let messageColor;
    let fontSize = this.width <= 640 ? 64 : 96;
    if (winner) {
      if (winner === "X") {
        message = "X Wins!";
        messageColor = "#0A1DC2";
      } else {
        message = "O Wins!";
        messageColor = "#C20A0A";
      }
    } else {
      message = "Draw!";
      messageColor = "#999999";
    }
    // Draw the rectangle
    c.save();
    c.fillStyle = "white";
    c.shadowColor = "rgba(0, 0, 0, 0.25)";
    c.shadowBlur = 10;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 5;
    c.fillRect(0, this.height * 0.25, this.width, this.height * 0.5);
    c.restore();
    // Draw the message
    c.save();
    c.fillStyle = messageColor;
    c.font = `bold ${fontSize}px Roboto`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(message, this.x, this.y);
    c.font = `${fontSize / 3}px Roboto`;
    c.fillText("The game will restart soon...", this.x, this.y + 96);
    c.restore();
  }
}
