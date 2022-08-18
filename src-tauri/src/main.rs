#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
fn count_api(counter: i32) -> i32 {
  println!("count_api: {}", counter);
  return counter + 1;
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![count_api])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
