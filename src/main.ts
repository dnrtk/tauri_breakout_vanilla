// import './style.css'
import { exit } from '@tauri-apps/api/process';
import { FIELD_WIDTH, FIELD_HEIGHT, Field } from './field';
import { Bar, DIRECTION } from './bar';
import { Ball } from './ball';
import { BlockList } from './block';
import { CalcNextStatus, calc_next_status } from './api';

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
  let req: CalcNextStatus = {
    field: field.status,
    bar: bar.status,
    ball: ball.status,
    block_list: block_list.getBlockStatusList()
  };
  let res = await calc_next_status(req) as CalcNextStatus;

  // APIの結果反映
  field.status = res.field;
  bar.status = res.bar;
  ball.status = res.ball;
  block_list.setBlockStatusList(res.block_list);

  // 画面更新
  ctx!.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT); //一旦全消去
  field.draw();
  bar.updatePosition(keyDirection);
  bar.draw();
  ball.draw();
  block_list.draw();
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
window.setInterval(mainLoop, 10);
