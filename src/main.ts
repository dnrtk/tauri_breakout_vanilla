// import './style.css'
import { exit } from '@tauri-apps/api/process';
import { FIELD_WIDTH, FIELD_HEIGHT, GAME_STATUS, Field } from './field';

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

let field = new Field(ctx);

const mainLoop = () => {
  field.draw();
}

window.setInterval(mainLoop, 100);
