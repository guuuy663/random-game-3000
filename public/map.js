import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export function buildMap(scene, data) {
  data.forEach(obj => {
    let mesh;

    if (obj.type === "floor") {
      mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(obj.w, obj.d),
        new THREE.MeshStandardMaterial({ color: 0x444444 })
      );
      mesh.rotation.x = -Math.PI / 2;
    }

    if (obj.type === "box") {
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(obj.w, obj.h, obj.d),
        new THREE.MeshStandardMaterial({ color: 0x666666 })
      );
      mesh.position.y = obj.h / 2;
    }

    if (obj.type === "platform") {
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(obj.w, obj.h, obj.d),
        new THREE.MeshStandardMaterial({ color: 0x888888 })
      );
    }

    mesh.position.x = obj.x;
    mesh.position.z = obj.z;
    if (obj.y) mesh.position.y = obj.y;

    mesh.receiveShadow = true;
    mesh.castShadow = true;

    scene.add(mesh);
  });
}
