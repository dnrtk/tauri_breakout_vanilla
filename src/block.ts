// Block size
const BLOCK_WIDTH = 100.0;
const BLOCK_HEIGHT = 20.0;
const BLOCK_COLOR_INIT = 'blue';
const BLOCK_BORDER_COLOR_INIT = 'navy';
// Block start position
const BLOCK_START_POS_X = 50.0;
const BLOCK_START_POS_Y = 50.0;
// Block num
const BLOCK_NUM_X = 4;
const BLOCK_NUM_Y = 3;

interface Pos2 {
  x: number,
  y: number
};

interface BlockStatus {
  pos_min: Pos2,
  pos_max: Pos2,
  color: String,
  border_color: String
};

class Block {
  ctx: CanvasRenderingContext2D;
  status: BlockStatus = {
    pos_min: {x: 0.0, y: 0.0},
    pos_max: {x: 0.0, y: 0.0},
    color: BLOCK_COLOR_INIT,
    border_color: BLOCK_BORDER_COLOR_INIT
};

  constructor(ctx: CanvasRenderingContext2D, start_x: number, start_y: number) {
    this.ctx = ctx;
    this.status.pos_min = {x: start_x, y: start_y};
    this.status.pos_max = {x: start_x + BLOCK_WIDTH, y: start_y + BLOCK_HEIGHT};
    this.draw();
  }

  draw() {
    // 描画(フィールド)
    this.ctx.beginPath();
    this.ctx.rect(this.status.pos_min.x, this.status.pos_min.y, BLOCK_WIDTH, BLOCK_HEIGHT);
    this.ctx.fillStyle = this.status.color as string;
    this.ctx.fill();
    this.ctx.strokeStyle = this.status.border_color as string;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }
}

interface BlockListStatus {
  block_num_x: number,
  block_num_y: number,
  block_list: Array<Block>
};

class BlockList {
  ctx: CanvasRenderingContext2D;
  status: BlockListStatus = {
    block_num_x: 4,
    block_num_y: 3,
    block_list: []
  };
  
  constructor(ctx: CanvasRenderingContext2D, block_num_x: number = BLOCK_NUM_X, block_num_y: number = BLOCK_NUM_Y) {
    this.ctx = ctx;
    this.status.block_num_x = block_num_x;
    this.status.block_num_y = block_num_y;

    for(let x = 0; x < block_num_x; x++ ) {
      for(let y = 0; y < block_num_y; y++ ) {
        let block = new Block(ctx, BLOCK_START_POS_X + (BLOCK_WIDTH * x), BLOCK_START_POS_Y + (BLOCK_HEIGHT * y));
        this.status.block_list.push(block);
      }
    }
  }

  draw() {
    for (let index = 0; index < this.status.block_list.length; index++) {
      let block = this.status.block_list[index];
      block.draw();
    }
  }

  getBlockStatusList() {
    let block_status_list = new Array<BlockStatus>;
    for (let index = 0; index < this.status.block_list.length; index++) {
      let block = this.status.block_list[index];
      block_status_list.push(block.status);
    }
    return block_status_list;
  }

  setBlockStatusList(block_status_list: Array<BlockStatus>) {
    this.status.block_list.splice(0);
    for (let index = 0; index < block_status_list.length; index++) {
      let block_status = block_status_list[index];
      let block = new Block(this.ctx, block_status.pos_min.x, block_status.pos_min.y);
      this.status.block_list.push(block);
    }
  }
}

export type {
  BlockStatus
}

export {
  BlockList
};
