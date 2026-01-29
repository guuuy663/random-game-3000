import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { input } from "./controls.js";
import { buildMap, colliders } from "./map.js";
import { buildWall } from "./build.js";

const socket = io();

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x202020);

const camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,0.1,1000);
camera.position.y=1.6;

const renderer=new THREE.WebGLRenderer();
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff,0x444444));

socket.on("map", map=> buildMap(scene,map));
socket.on("build", obj=> buildMap(scene,[obj]));

let x=0,z=0,rot=0;

function collide(nx,nz){
  return colliders.some(c=>
    Math.abs(nx-c.position.x)<2 &&
    Math.abs(nz-c.position.z)<2
  );
}

function animate(){
  requestAnimationFrame(animate);

  rot+=input.t;
  const nx=x+Math.sin(rot)*input.f*0.1;
  const nz=z+Math.cos(rot)*input.f*0.1;

  if(!collide(nx,nz)){ x=nx; z=nz; }

  camera.rotation.y=rot;
  camera.position.set(x,1.6,z);

  if(input.build){
    const wall=buildWall(x+Math.sin(rot)*3,z+Math.cos(rot)*3);
    socket.emit("build",wall);
    input.build=false;
  }

  socket.emit("update",{x,z,rot});
  renderer.render(scene,camera);
}

document.body.onclick=()=>document.body.requestPointerLock();
animate();

