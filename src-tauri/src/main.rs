#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::{ Serialize, Deserialize };
use std::f64::consts::PI;

// Ball parameters
const BALL_RADIUS: f32 = 5.0;
const BALL_START_POS_X_INIT: f32 = 250.0;
const BALL_START_POS_Y_INIT: f32 = 495.0;
const BALL_SPEED_INIT: f64 = 5.0;
const BALL_DEG_INIT: f64 = 135.0;

const PLAYING: i32 = 0;
const GAME_OVER: i32 = 2;
const GAME_CLEAR: i32 = 3;

#[tauri::command]
fn count_api(counter: i32) -> i32 {
  println!("count_api: {}", counter);
  return counter + 1;
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Pos2 {
  x: f32,
  y: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Field {
  pub pos_min: Pos2,
  pub pos_max: Pos2,
  color: String,
  border_color: String,
  game_status: i32
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Bar {
  pub pos_min: Pos2,
  pub pos_max: Pos2,
  color: String,
  border_color: String,
  speed: f32,
  left_min: f32,
  right_max: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Ball {
  pos: Pos2,
  speed: f64,
  deg: f64,
  pos_delta: Pos2,
  color: String,
}

impl Ball {
  fn update_deg(&mut self, deg: f64) {
    // 引数degは進行方向を下方向を0として半時計回りに0-360度までを指定する
    self.deg = deg % 360.0;
    let rad = deg / 180.0 * PI;
    self.pos_delta = Pos2 {
        x: (self.speed * rad.sin()) as f32,
        y: (self.speed * rad.cos()) as f32
    };
  }

  fn update_position(&mut self, field: &Field, block_list: &mut Vec<Block>, bar: &Bar) {
    // 移動先座標を計算
    let mut next_pos = self.pos.clone();
    next_pos.x += self.pos_delta.x;
    next_pos.y += self.pos_delta.y;
  
    // barとの衝突判定
    if (bar.pos_min.x <= next_pos.x) && (next_pos.x <= bar.pos_max.x) {
        if (next_pos.y <= bar.pos_min.y) && ((bar.pos_min.y - next_pos.y) <= BALL_RADIUS) {
            // 上部接触判定
            next_pos.y = bar.pos_min.y - BALL_RADIUS;
            let next_deg = (360.0 + (180.0 - self.deg)) % 360.0;
            self.update_deg(next_deg * 0.95);
        }
    }
  
    // fieldとの衝突判定
    if (field.pos_min.x <= next_pos.x) && (next_pos.x <= field.pos_max.x) {
        if (next_pos.y - field.pos_min.y) <= BALL_RADIUS {
            // 上部接触判定
            next_pos.y = field.pos_min.y + BALL_RADIUS;
            let next_deg = (180.0 + (360.0 - self.deg)) % 360.0;
            self.update_deg(next_deg);
        }
        else if (field.pos_max.y - next_pos.y) <= BALL_RADIUS {
            // 下部接触判定
            self.speed = 0.0;
            self.update_deg(BALL_DEG_INIT);
        }
    }
    else if (field.pos_min.y <= next_pos.y) && (next_pos.y <= field.pos_max.y) {
        if (next_pos.x - field.pos_min.x) <= BALL_RADIUS {
            // 左部接触判定
            next_pos.x = field.pos_min.x + BALL_RADIUS;
            let next_deg = (90.0 + (270.0 - self.deg)) % 360.0;
            self.update_deg(next_deg);
        }
        else if (field.pos_max.x - next_pos.x) < BALL_RADIUS {
            // 右部接触判定
            next_pos.x = field.pos_max.x - BALL_RADIUS;
            let next_deg = (270.0 + (90.0 - self.deg)) % 360.0;
            self.update_deg(next_deg);
        }
    }
  
    // blockとの衝突判定
    let mut del_index: usize = usize::MAX;
    for index in 0..block_list.len() {
        let pos_min = block_list[index].pos_min.clone();
        let pos_max = block_list[index].pos_max.clone();
  
        if (pos_min.x <= next_pos.x) && (next_pos.x <= pos_max.x) {
            if (next_pos.y <= pos_min.y) && ((pos_min.y - next_pos.y) <= BALL_RADIUS) {
                // 上部接触判定
                next_pos.y = pos_min.y - BALL_RADIUS;
                let next_deg = (360.0 + (180.0 - self.deg)) % 360.0;
                self.update_deg(next_deg);
                del_index = index;
                break;
            }
            else if (pos_max.y <= next_pos.y) && ((next_pos.y - pos_max.y) <= BALL_RADIUS) {
                // 下部接触判定
                next_pos.y = pos_max.y + BALL_RADIUS;
                let next_deg = (180.0 + (360.0 - self.deg)) % 360.0;
                self.update_deg(next_deg);
                del_index = index;
                break;
            }
        }
        else if (pos_min.y <= next_pos.y) && (next_pos.y <= pos_max.y) {
            if (next_pos.x <= pos_min.x) && ((pos_min.x - next_pos.x) <= BALL_RADIUS) {
                // 左部接触判定
                next_pos.x = pos_min.x - BALL_RADIUS;
                let next_deg = (270.0 + (90.0 - self.deg)) % 360.0;
                self.update_deg(next_deg);
                del_index = index;
                break;
            }
            else if (pos_max.x <= next_pos.x) && ((next_pos.x - pos_max.x) <= BALL_RADIUS) {
                // 右部接触判定
                next_pos.x = pos_max.x + BALL_RADIUS;
                let next_deg = (90.0 + (270.0 - self.deg)) % 360.0;
                self.update_deg(next_deg);
                del_index = index;
                break;
            }
        }
    }
    // 接触したブロックを削除
    if del_index != usize::MAX {
        block_list.remove(del_index);
    }
  
    // 座標更新
    self.pos = next_pos;
  }

  pub fn is_stopped(&mut self) -> bool {
    return self.speed == 0.0;
  }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Block {
  pub pos_min: Pos2,
  pub pos_max: Pos2,
  color: String,
  border_color: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct CalcNextStatus {
  field: Field,
  bar: Bar,
  ball: Ball,
  block_list: Vec<Block>
}

#[tauri::command]
fn calc_next_status(req: CalcNextStatus) -> CalcNextStatus {
  println!("calc_next_status: {}, {}", req.ball.pos.x, req.ball.pos.y);

  // 引数処理
  let mut res = req.clone();
  let field = &mut res.field;
  let bar = &mut res.bar;
  let ball = &mut res.ball;
  let block_list = &mut res.block_list;

  // 座標更新
  ball.update_position(field, block_list, bar);

  // クリア判定
  if block_list.len() == 0 {
    field.game_status = GAME_CLEAR;
  }
  else if ball.is_stopped() {
    field.game_status = GAME_OVER;
  }

  return res;
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![count_api, calc_next_status])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
