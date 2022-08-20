// import './style.css'
import { exit } from '@tauri-apps/api/process';
import { FIELD_WIDTH, FIELD_HEIGHT, GAME_STATUS, Field } from './field';
import { Bar, DIRECTION } from './bar';
import { Ball } from './ball';
import { BlockList } from './block';
import { Pos2, calc_next_status } from './api';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <center><canvas id="my_canvas"></canvas></center>
  </div>
`
// Canvas取得
const canvasElem = document.getElementById("my_canvas") as HTMLCanvasElement;
canvasElem.width = FIELD_WIDTH;
canvasElem.height = FIELD_HEIGHT;
const ctx = canvasElem && canvasElem.getContext("2d");
if (!canvasElem || !ctx) {
  alert('No ctx!');
  exit;
};

let field = new Field(ctx!);
let bar = new Bar(ctx!, 0.0, FIELD_WIDTH);
let keyDirection = DIRECTION.NONE;
let ball = new Ball(ctx!);
let block_list = new BlockList(ctx!);

const keyDown = (e: any) => {
  switch(e.key) {
    case 'ArrowLeft':
      keyDirection = DIRECTION.LEFT;
      break;
    case 'ArrowRight':
      keyDirection = DIRECTION.RIGHT;
      break;
    default:
      break;
  }
};

const keyUp = (e: any) => {
  if((e.key == 'ArrowLeft' && DIRECTION.LEFT == keyDirection)
  || (e.key == 'ArrowRight' && DIRECTION.RIGHT == keyDirection)) {
    keyDirection = DIRECTION.NONE;
  }
};

const mainLoop = async () => {
  // 状態更新
  // let req: Pos2 = {x: 12.34, y: 56.78};
  let req = ball.status.pos;
  let res = await calc_next_status(req);
  ball.status.pos = res as Pos2;

  // 画面更新
  ctx!.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT); //一旦全消去
  field.draw();
  bar.updatePosition(keyDirection);
  bar.draw();
  // ball.updatePosition({x: ball.status.pos.x + 1, y: ball.status.pos.y - 1});
  ball.draw();
  block_list.draw();
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
window.setInterval(mainLoop, 10);
