const app = require("express")();
const dotenv = require("dotenv");
const log = require("@ajar/marker");
const cors = require("cors");
const { Server } = require("socket.io");

dotenv.config();
const { CLIENT_URL } = process.env;
const PORT = process.env.PORT ;
const HOST = process.env.HOST;

app.use(cors());
app.use("*", (req, res) => res.send("hello from express"));
const http = require("http").createServer(app);

(async () => {
  await http.listen(PORT, HOST);
  log.magenta(`server is live on`, `  ✨ ⚡  http://${HOST}:${PORT} ✨ ⚡`);
})().catch((error) => log.error(error));

const io = new Server(http, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

let playagain = [];
let rooms = {};
let clients = {};
const PLAY = "PLAY";
const READY = "READY";
let users = 0;

io.sockets.on("connection", (socket) => {
  users++;
  io.emit("data", { usersCount: users });

  /// player disconnected.
  socket.on("disconnect", function () {
    if (playagain.includes(socket.id)) {
      playagain.splice(playagain.indexOf(socket.id), 1);
    } else {
      let room = clients[socket.id];
      socket.to(room).emit("data", { isLeave: true });
      delete rooms[room];
    }
    users--;
    io.emit("data", { usersCount: users });
  });

  socket.on("data", (data = {}) => {
    const {
      room,
      action,
      board,
      turn,
      toPlayer,
      ships,
      guess,
      isWinning,
      playAgainEmit,
    } = data;
    if (playAgainEmit) {
      playagain.push(socket.id);
      socket.to(room).emit("data", { playAgainRequest: "true" });
    }

    // play - means joining a room.
    if (action === PLAY && room !== null) {
      if (!rooms[room]) rooms[room] = [];
      if (rooms[room].length >= 2) {
        socket.emit("data", "REFRESH");
        return false;
      }
      socket.join(room);
      rooms[room].push(socket.id);
      clients[socket.id] = room;
      // tell the client that another player is in (and then show the 'ready' button)
      if (rooms[room].length == 2) {
        io.in(room).emit("data", { otherPlayerConnected: true });
      }
    }

    // ready - sends the players board and turn to the other player
    if (action === READY) {
      if (toPlayer === "1") {
        socket.to(room).emit("data", { board, ships, turn, toPlayer });

        // if both players are ready - start the game
        io.in(room).emit("data", { readyToStart: true });
      } else {
        socket.to(room).emit("data", { board, ships, turn, toPlayer });
      }
    }

    // guess - sending a guess to the other player
    if (guess) {
      socket.to(room).emit("data", { guess });
    }

    // isWinning - if one of the players won, notify the players
    if (isWinning) {
      socket.to(room).emit("data", { isWinning });
      rooms[room] = [];
    }
  });
});
