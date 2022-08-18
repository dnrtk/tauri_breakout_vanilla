import { invoke } from '@tauri-apps/api/tauri';

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }

  element.addEventListener('click', () => {
    invoke('count_api', {counter}).then(res => {
      console.log(res);
      setCounter(res as number);
    }).catch(e => {
      console.error(e);
    })
  })

  setCounter(0)
}
