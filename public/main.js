
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { input, pollGamepad } from "./controls.js";
import { buildMap } from "./map.js";

const socket = io();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, 0.1, 1000);
camera.position.y = 1.6;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff,0x444444));

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100,100),
  new THREE.MeshStandardMaterial({color:0x555555})
);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

const players = {};
let myId;

socket.on("connect", ()=> myId = socket.id);

socket.on("state", state => {
  for (let id in state) {
    if (!players[id]) {
      players[id] = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.4,1),
        new THREE.MeshStandardMaterial({color: id===myId?0x00ff00:0xff0000})
      );
      scene.add(players[id]);
    }
    players[id].position.set(state[id].x,1,state[id].z);
    players[id].rotation.y = state[id].rot;
  }
});

let x=0, z=0, rot=0;

function animate(){
  requestAnimationFrame(animate);

  pollGamepad();

  rot += input.turn;
  x += Math.sin(rot)*input.forward*0.1;
  z += Math.cos(rot)*input.forward*0.1;

  camera.rotation.y = rot;
  camera.position.set(x,1.6,z);

  if (input.shoot) {
    socket.emit("hit", Object.keys(players).find(id=>id!==myId));
  }

  socket.emit("update",{x,z,rot});
  renderer.render(scene,camera);
}
animate();

document.body.onclick = ()=>document.body.requestPointerLock();

