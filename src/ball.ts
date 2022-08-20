// Ball parameters
const BALL_RADIUS = 5.0;
const BALL_START_POS_X_INIT = 250.0;
const BALL_START_POS_Y_INIT = 495.0;
const BALL_SPEED_INIT = 5.0;
const BALL_DEG_INIT = 135.0;
const BALL_COLOR_INIT = 'red';

interface Pos2 {
  x: number,
  y: number
};

interface Vec2 {
  x: number,
  y: number
};

interface BallStatus {
  pos: Pos2,
  speed: number,
  deg: number,
  pos_delta: Vec2,
  color: String
};

class Ball {
  ctx: CanvasRenderingContext2D;
  status: BallStatus = {
    pos: {x: BALL_START_POS_X_INIT, y: BALL_START_POS_Y_INIT},
    pos_delta: {x: 0.0, y: 0.0},
    speed: BALL_SPEED_INIT,
    deg: BALL_DEG_INIT,
    color: BALL_COLOR_INIT
};

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.draw();
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.status.pos.x, this.status.pos.y, BALL_RADIUS, 0, 2 * Math.PI);
    this.ctx.fillStyle = "rgba(255,0,0,0.8)"
    this.ctx.fill();
  }

  updatePosition(pos: Vec2) {
    this.status.pos = pos;
  }
}

export type {
  BallStatus
}

export {
  Ball
};
