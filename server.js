const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { loadMap, saveMap } = require("./map");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const players = {};
const mapData = loadMap();

io.on("connection", socket => {
  players[socket.id] = { x:0,z:0,rot:0 };

  socket.emit("map", mapData);

  socket.on("update", d => Object.assign(players[socket.id], d));

  socket.on("build", obj => {
    mapData.push(obj);
    saveMap(mapData);
    io.emit("build", obj);
  });

  socket.on("disconnect", ()=> delete players[socket.id]);
});

setInterval(()=> io.emit("state", players), 50);

server.listen(process.env.PORT || 3000);
