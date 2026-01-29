import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export const colliders=[];

export function buildMap(scene,data){
  data.forEach(o=>{
    let m;

    if(o.type==="floor"){
      m=new THREE.Mesh(
        new THREE.PlaneGeometry(o.w,o.d),
        new THREE.MeshStandardMaterial({color:0x444444})
      );
      m.rotation.x=-Math.PI/2;
    }

    if(o.type==="box"){
      m=new THREE.Mesh(
        new THREE.BoxGeometry(o.w,o.h,o.d),
        new THREE.MeshStandardMaterial({color:0x666666})
      );
      m.position.y=o.h/2;
      colliders.push(m);
    }

    if(o.type==="loot"){
      m=new THREE.Mesh(
        new THREE.SphereGeometry(0.5),
        new THREE.MeshStandardMaterial({color:0xffff00})
      );
      m.position.y=1;
    }

    m.position.x=o.x;
    m.position.z=o.z;
    scene.add(m);
  });
}
