#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::{ Serialize, Deserialize };

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
struct Vec2 {
  x: f32,
  y: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Field {
  pub pos_min: Pos2,
  pub pos_max: Pos2,
  color: String,
  border_color: String,
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
  pos_delta: Vec2,
  color: String,
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
  // x: f32,
  // y: f32,
  field: Field,
  bar: Bar,
  ball: Ball,
  block_list: Vec<Block>
}

#[tauri::command]
fn calc_next_status(req: CalcNextStatus) -> CalcNextStatus {
  println!("calc_next_status: {}, {}", req.ball.pos.x, req.ball.pos.y);
  let mut res = req.clone();

  res.ball.pos.x += 1.0;
  res.ball.pos.y -= 2.0;

  return res;
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![count_api, calc_next_status])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
