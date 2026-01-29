const fs = require("fs");
const FILE = "savedMap.json";

function generateMap() {
  const objs = [];

  objs.push({ type:"floor", x:0,z:0,w:100,d:100 });

  for(let i=0;i<20;i++){
    objs.push({
      type:"box",
      x:Math.random()*80-40,
      y:1,
      z:Math.random()*80-40,
      w:3,h:3,d:3
    });
  }

  for(let i=0;i<8;i++){
    objs.push({
      type:"loot",
      x:Math.random()*60-30,
      y:1,
      z:Math.random()*60-30
    });
  }

  return objs;
}

function loadMap(){
  if(fs.existsSync(FILE))
    return JSON.parse(fs.readFileSync(FILE));
  const map = generateMap();
  saveMap(map);
  return map;
}

function saveMap(map){
  fs.writeFileSync(FILE, JSON.stringify(map));
}

module.exports = { loadMap, saveMap };


module.exports = generateMap;
