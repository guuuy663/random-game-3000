const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { loadMap, saveMap } = require("./map");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const players = {};
const bots = {};
const mapData = loadMap();

function spawnBot(id){
  bots[id] = {
    id,
    x: Math.random()*40-20,
    z: Math.random()*40-20,
    hp: 100
  };
}

for(let i=0;i<5;i++) spawnBot("bot"+i);

io.on("connection", socket => {
  players[socket.id] = {
    x:0,z:0,rot:0,
    hp:100,
    money:0,
    damage:20
  };

  socket.emit("map", mapData);

  socket.on("update", d => Object.assign(players[socket.id], d));

  socket.on("shoot", targetId => {
    if(bots[targetId]){
      bots[targetId].hp -= players[socket.id].damage;
      if(bots[targetId].hp <= 0){
        players[socket.id].money += 100;
        spawnBot(targetId);
      }
    }
  });

  socket.on("buy", item => {
    if(item === "rifle" && players[socket.id].money >= 300){
      players[socket.id].money -= 300;
      players[socket.id].damage = 40;
    }
  });

  socket.on("build", obj => {
    mapData.push(obj);
    saveMap(mapData);
    io.emit("build", obj);
  });

  socket.on("disconnect", ()=> delete players[socket.id]);
});

setInterval(()=>{
  // bot AI
  Object.values(bots).forEach(bot=>{
    const targets = Object.values(players);
    if(!targets.length) return;

    const p = targets[0];
    const dx = p.x - bot.x;
    const dz = p.z - bot.z;
    const d = Math.hypot(dx,dz);

    if(d < 20){
      bot.x += dx/d * 0.05;
      bot.z += dz/d * 0.05;
    }
  });

  io.emit("state",{ players, bots });
},50);

server.listen(process.env.PORT || 3000);
