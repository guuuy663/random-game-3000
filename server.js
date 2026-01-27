const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const players = {};

io.on("connection", socket => {
  players[socket.id] = {
    x: 0, z: 0, rot: 0, hp: 100
  };

  socket.on("update", data => {
    Object.assign(players[socket.id], data);
  });

  socket.on("hit", id => {
    if (players[id]) {
      players[id].hp -= 25;
      if (players[id].hp <= 0) {
        players[id].hp = 100;
        players[id].x = Math.random() * 10 - 5;
        players[id].z = Math.random() * 10 - 5;
      }
    }
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
  });
});

setInterval(() => {
  io.emit("state", players);
}, 50);

server.listen(3000, () => console.log("Server running"));
