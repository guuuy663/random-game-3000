export const input={f:0,t:0,build:false};

window.addEventListener("keydown",e=>{
  if(e.key==="w")input.f=1;
  if(e.key==="s")input.f=-1;
});
window.addEventListener("keyup",()=>input.f=0);

window.addEventListener("mousemove",e=>{
  if(document.pointerLockElement)
    input.t=-e.movementX*0.002;
});

document.getElementById("build").onclick=()=>input.build=true;
