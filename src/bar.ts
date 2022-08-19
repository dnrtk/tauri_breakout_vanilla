// Bar size
const BAR_WIDTH = 70.0;
const BAR_HEIGHT = 10.0;
// Bar position
const BAR_START_POS_X_INIT = 200.0;
const BAR_START_POS_Y_INIT = 500.0;
// Bar color
const BAR_COLOR_INIT = '#AAAAAA';
const BAR_BORDER_COLOR_INIT = '#111111';
// Bar speed
const BAR_SPEED_INIT = 3.0;

enum DIRECTION {
  NONE,
  RIGHT,
  LEFT,
}

interface Pos2 {
  x: number,
  y: number
}

interface BarStatus {
  pos_min: Pos2,
  pos_max: Pos2,
  color: String,
  border_color: String,
  speed: number,
  left_min: number,
  right_max: number,
};

class Bar {
  ctx: CanvasRenderingContext2D;
  status: BarStatus = {
    pos_min: {x: BAR_START_POS_X_INIT, y: BAR_START_POS_Y_INIT},
    pos_max: {x: BAR_START_POS_X_INIT + BAR_WIDTH, y: BAR_START_POS_Y_INIT + BAR_HEIGHT},
    color: BAR_COLOR_INIT,
    border_color: BAR_BORDER_COLOR_INIT,
    speed: BAR_SPEED_INIT,
    left_min: 0,
    right_max: 500,
  };

  constructor(ctx: CanvasRenderingContext2D, left_min: number, right_max: number) {
    this.ctx = ctx;
    this.status.left_min = left_min;
    this.status.right_max = right_max;
    this.draw();
  }

  draw() {
    // 描画(バー)
    this.ctx.beginPath();
    this.ctx.rect( this.status.pos_min.x, this.status.pos_min.y, BAR_WIDTH, BAR_HEIGHT);
    this.ctx.fillStyle = this.status.color as string;
    this.ctx.fill();
    this.ctx.strokeStyle = this.status.border_color as string;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  updatePosition(direction: DIRECTION) {
    switch(direction) {
      case DIRECTION.RIGHT:
        this.status.pos_max.x += this.status.speed;
        if(this.status.pos_max.x > this.status.right_max) {
          this.status.pos_max.x = this.status.right_max;
        }
        this.status.pos_min.x = this.status.pos_max.x - BAR_WIDTH;
        break;
      case DIRECTION.LEFT:
        this.status.pos_min.x -= this.status.speed;
        if(this.status.pos_min.x < this.status.left_min) {
          this.status.pos_min.x = this.status.left_min;
        }
        this.status.pos_max.x = this.status.pos_min.x + BAR_WIDTH;
        break;
    }
  }

}

export {
  DIRECTION,
  Bar
};
