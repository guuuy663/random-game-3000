export function buildWall(x,z){
  return {
    type:"box",
    x,
    y:1,
    z,
    w:3,
    h:3,
    d:0.5
  };
}
