class UI {
  constructor(game) {
    this.game = game;
    this.width = this.game.width;
    this.height = this.game.height;
  }
}

export class Header extends UI {
  constructor(game) {
    super(game);
    this.gameLogo = new Image();
    this.gameLogo.src = "./assets/game_logo.png";
  }
  logo(c) {
    c.drawImage(
      this.gameLogo,
      this.width * 0.5 - 50,
      this.height * 0.075,
      100,
      118
    );
  }
}

export class Footer extends UI {
  constructor(game) {
    super(game);
    this.myLogo = new Image();
    this.myLogo.src = "./assets/logo_bo.png";
  }
  draw(c) {
    c.drawImage(this.myLogo, this.width * 0.4 - 24, this.height - 128, 48, 48);
    c.save();
    c.fillStyle = "black";
    c.textAlign = "left";
    c.textBaseline = "middle";
    c.font = "24px Roboto";
    c.fillText(
      "2024 Edward Vonschondorf",
      this.width * 0.425,
      this.height - 120
    );
    c.fillStyle = "#C76E00";
    c.fillText("edward-vonschondorf.dev", this.width * 0.425, this.height - 88);
    c.restore();
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
    this.xTurnImg = new Image();
    this.xTurnImg.src = "./assets/x_turn.png";
    this.oTurnImg = new Image();
    this.oTurnImg.src = "./assets/o_turn.png";
  }
  draw({ c, player, x_Xpos, o_Xpos, y }) {
    c.save();
    c.globalAlpha = player === "X" ? 1 : 0.2;
    c.drawImage(this.xTurnImg, x_Xpos, y, 54, 89);
    c.globalAlpha = player === "O" ? 1 : 0.2;
    c.drawImage(this.oTurnImg, o_Xpos, y, 64, 89);
    c.restore();
  }
}

export class EndGameMessage extends UI {
  constructor(game) {
    super(game);
  }
  draw({ c, winner, message, x, y }) {
    c.save();
    c.fillStyle = "white";
    c.shadowColor = "rgba(0, 0, 0, 0.25)";
    c.shadowBlur = 10;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 5;
    c.fillRect(
      0,
      this.game.height * 0.25 + this.game.height * 0.125,
      this.game.width,
      this.game.height * 0.25
    );
    if (winner === "X") c.fillStyle = "#0A1DC2";
    else if (winner === "O") c.fillStyle = "#C20A0A";
    else {
      c.fillStyle = "#999999";
    }
    c.font = "bold 96px Roboto";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(message, x, y);
    c.font = "32px Roboto";
    c.fillText("The game will restart soon...", x, y + 96);
    c.restore();
  }
}
