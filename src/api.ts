import { invoke } from '@tauri-apps/api/tauri';

import { FieldStatus } from './field';
import { BarStatus } from './bar';
import { BallStatus } from './ball';
import { BlockStatus } from './block';

interface Pos2 {
    x: number,
    y: number
};

interface CalcNextStatus {
    field: FieldStatus,
    bar: BarStatus,
    ball: BallStatus,
    block_list: Array<BlockStatus>
}

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
    CalcNextStatus
};

export {
    calc_next_status
};

