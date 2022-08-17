const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const PORT = 4000;
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("ユーザーと接続しました。" + "socket-id:" + socket.id);

  // ルームに入る時のソケット設定
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`ユーザーID:${socket.id}が${data}に参加しました！`);
  });

  // チャット専用のソケット設定
  socket.on("send_message", (data) => {
    console.log(data);
    // クライアントに返すソケット通信(room番号を共有している人のみ)
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("ユーザーとの接続が切れました！" + "socket-id:" + socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
