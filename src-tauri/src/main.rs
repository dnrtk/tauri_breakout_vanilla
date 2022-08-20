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
struct CalcNextStatus {
  x: f32,
  y: f32,
}

#[tauri::command]
fn calc_next_status(req: CalcNextStatus) -> CalcNextStatus {
  println!("calc_next_status: {}, {}", req.x, req.y);
  let mut res = req.clone();

  res.x += 1.0;
  res.y -= 2.0;
  
  return res;
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![count_api, calc_next_status])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
