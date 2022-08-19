// Field position
const FIELD_START_POS_X_INIT = 0.0;
const FIELD_START_POS_Y_INIT = 0.0;
// Field size
const FIELD_WIDTH = 500.0;
const FIELD_HEIGHT = 600.0;
// Field line
const FIELD_FILL_STYLE = "#FAFAFA";
const FIELD_STROKE_STYLE = "black";
const FIELD_LINE_WIDTH = 3;

enum GAME_STATUS {
  PLAYING = 0,
  GAME_OVER = 2,
  GAME_CLEAR = 3
};

class Field {
  ctx: CanvasRenderingContext2D;
  game_status = GAME_STATUS.PLAYING;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.draw();
  }

  draw() {
    // 描画(フィールド)
    this.ctx.beginPath();
    this.ctx.rect(FIELD_START_POS_X_INIT, FIELD_START_POS_Y_INIT, FIELD_WIDTH, FIELD_HEIGHT);
    // this.ctx.rect(0, 0, 510, 610);
    this.ctx.fillStyle = FIELD_FILL_STYLE;
    this.ctx.fill();
    this.ctx.strokeStyle = FIELD_STROKE_STYLE;
    this.ctx.lineWidth = FIELD_LINE_WIDTH;
    this.ctx.stroke();

    switch(this.game_status) {
      case GAME_STATUS.GAME_OVER:
        this.drawGameOver();
        break;
      case GAME_STATUS.GAME_CLEAR:
        this.drawGameClear();
        break;
      default:
        break;
    }
  }

  drawGameOver() {
    var str = 'GAME OVER';
    this.ctx.fillStyle = 'red';
    this.ctx.font = 'italic bold 55px serif';
    this.ctx.fillText(str, 75, 300);
  }

  drawGameClear() {
    var str = 'GAME CLEAR';
    this.ctx.fillStyle = 'green';
    this.ctx.font = 'italic bold 55px serif';
    this.ctx.fillText(str, 55, 300);
  }

  setGameStatus(game_status: GAME_STATUS) {
    this.game_status = game_status;
  }
}

export {
  FIELD_WIDTH,
  FIELD_HEIGHT,
  GAME_STATUS,
  Field
};
