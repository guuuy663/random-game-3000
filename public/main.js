import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { input } from "./controls.js";
import { buildMap, colliders } from "./map.js";
import { buildWall } from "./build.js";
import { setupShop } from "./shop.js";

const socket = io();

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x202020);

const camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,0.1,1000);
camera.position.y=1.6;

const renderer=new THREE.WebGLRenderer();
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff,0x444444));

let botsMeshes={};
let state={};

socket.on("map", map=> buildMap(scene,map));
socket.on("state", s=> state=s);
socket.on("build", obj=> buildMap(scene,[obj]));

setupShop(socket);

let x=0,z=0,rot=0;

function animate(){
  requestAnimationFrame(animate);

  rot+=input.t;
  x+=Math.sin(rot)*input.f*0.1;
  z+=Math.cos(rot)*input.f*0.1;

  camera.rotation.y=rot;
  camera.position.set(x,1.6,z);

  if(input.build){
    socket.emit("build",buildWall(x+Math.sin(rot)*3,z+Math.cos(rot)*3));
    input.build=false;
  }

  // render bots
  if(state.bots){
    Object.values(state.bots).forEach(b=>{
      if(!botsMeshes[b.id]){
        const m=new THREE.Mesh(
          new THREE.BoxGeometry(1,2,1),
          new THREE.MeshStandardMaterial({color:0xff0000})
        );
        scene.add(m);
        botsMeshes[b.id]=m;
      }
      botsMeshes[b.id].position.set(b.x,1,b.z);
    });
  }

  socket.emit("update",{x,z,rot});
  renderer.render(scene,camera);
}

document.body.onclick=()=>{
  document.body.requestPointerLock();
  document.addEventListener("click",()=>{
    const hit = Object.keys(state.bots||{})[0];
    if(hit) socket.emit("shoot",hit);
  });
};

animate();
