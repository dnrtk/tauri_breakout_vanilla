// import './style.css'
import { exit } from '@tauri-apps/api/process';
import { FIELD_WIDTH, FIELD_HEIGHT, GAME_STATUS, Field } from './field';
import { Bar, DIRECTION } from './bar';
import { Ball } from './ball';

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

const mainLoop = () => {
  ctx!.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT); //一旦全消去
  field.draw();
  bar.updatePosition(keyDirection);
  bar.draw();
  // ball.updatePosition({x: ball.status.pos.x + 1, y: ball.status.pos.y - 1});
  ball.draw();
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
window.setInterval(mainLoop, 10);
