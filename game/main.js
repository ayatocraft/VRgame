import { sendState, receiveState } from "./net.js";
import { createCPU } from "./ai.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000);
camera.position.y = 1.6;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ライト
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(10,20,10);
scene.add(light);

scene.add(new THREE.AmbientLight(0x404040,2));

// 床
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100,100),
  new THREE.MeshStandardMaterial({color:0x222222})
);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// プレイヤー
let player = {
  id:Math.random().toString(36).substr(2,5),
  hp:100,
  ammo:30,
  pos:new THREE.Vector3()
};

// 銃（仮）
const gun = new THREE.Mesh(
  new THREE.BoxGeometry(0.2,0.2,1),
  new THREE.MeshStandardMaterial({color:0x5555ff})
);
gun.position.set(0.3,-0.3,-0.5);
camera.add(gun);
scene.add(camera);

// CPU
let cpus = [];
for(let i=0;i<5;i++) cpus.push(createCPU(i));

// 他プレイヤー
let others = {};

// 通信受信
receiveState(data=>{
  if(data.id === player.id) return;
  others[data.id] = data;
});

// 操作
let keys={};
document.addEventListener("keydown",e=>keys[e.key]=true);
document.addEventListener("keyup",e=>keys[e.key]=false);

// マウス視点
let yaw=0,pitch=0;
document.addEventListener("mousemove",e=>{
  yaw -= e.movementX*0.002;
  pitch -= e.movementY*0.002;
  camera.rotation.set(pitch,yaw,0);
});

// 射撃
document.addEventListener("click",()=>{
  if(player.ammo>0){
    player.ammo--;
  }
});

// リロード
document.addEventListener("keydown",e=>{
  if(e.key==="r") player.ammo=30;
});

// 更新
function update(){
  // 移動
  if(keys["w"]) camera.position.z -=0.1;
  if(keys["s"]) camera.position.z +=0.1;
  if(keys["a"]) camera.position.x -=0.1;
  if(keys["d"]) camera.position.x +=0.1;

  // CPU
  cpus.forEach(cpu=>{
    cpu.update(camera.position);
  });

  // 送信
  sendState({
    id:player.id,
    x:camera.position.x,
    z:camera.position.z,
    hp:player.hp
  });

  // HUD
  document.getElementById("ammo").innerText="Ammo:"+player.ammo;
}

// 描画
function animate(){
  requestAnimationFrame(animate);
  update();
  renderer.render(scene,camera);
}
animate();