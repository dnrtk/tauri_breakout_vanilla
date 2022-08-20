import { invoke } from '@tauri-apps/api/tauri';

interface Pos2 {
    x: number,
    y: number
};

const calc_next_status = async (req: any) => {
    let res;
    try {
        res = await invoke('calc_next_status', {req});
    } catch(e) {
        alert(e);
    }
    return res;
};

export type {
    Pos2
};

export {
    calc_next_status
};

