export function setupShop(socket){
  document.getElementById("shop").onclick = ()=>{
    socket.emit("buy","rifle");
  };
}
