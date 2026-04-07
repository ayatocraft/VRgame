export function createCPU(id){
  return {
    id:"CPU"+id,
    hp:100,
    pos:{x:Math.random()*20-10,z:Math.random()*20-10},
    update(player){
      // 簡易AI（プレイヤー追跡）
      let dx = player.x - this.pos.x;
      let dz = player.z - this.pos.z;

      this.pos.x += dx * 0.01;
      this.pos.z += dz * 0.01;
    }
  }
}