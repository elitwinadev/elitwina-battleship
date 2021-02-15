import jwt from 'jsonwebtoken';
import express from 'express';
import log from '@ajar/marker';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './db/mongoose.connection.mjs';
import userModel from './db/user.model.mjs';

const app = express();
const httpServer = http.createServer(app);
const { CLIENT_URL, HOST, PORT, DB_URI, JWT_KEY } = process.env;


let playagain = [];
let rooms = {};
let clients = {};
const PLAY = "PLAY";
const READY = "READY";
let users = 0;


const login = async (req, res) => {
  const isExists = await userModel.find({
    username: req.body.username,
    password: req.body.password
  });
  if (isExists[0]) {
    const token = jwt.sign({
      id: isExists[0]._id
    }, JWT_KEY);
    res.status(200).json(token);
  }
  else {
    res.status(401).send(false);
  }
}

const register = async (req, res) => {
  const isExists = await userModel.find({ username: req.body.username });
  if (isExists[0]) {
    res.status(401).json("isExists");
  }
  else {
    let user = await userModel.create({
      username: req.body.username,
      password: req.body.password
    });
    res.status(200).json("OK");
  }
}

app.use(express.json());
app.use(cors());


app.use('/register', register);
app.use('/login', login);

//when no routes were matched...
app.use('*', (req, res) => {
  res.status(200).json({ status: `Welcome home!` })
});



(async () => {
  await connectDB(DB_URI, { useUnifiedTopology: true });
  await httpServer.listen(PORT, HOST);
  log.magenta(`server is live on`, `  ✨ ⚡  http://${HOST}:${PORT} ✨ ⚡`);
})().catch((error) => log.error(error));

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});
io.sockets.on("connection", (socket) => {
  users++;
  console.log("connected: ", socket.id);
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
      IncomingMessage
    } = data;
    if (action === 'EMOJI') {
      socket.to(room).emit("data", { action: 'EMOJI', value: data.value });
    }
    if (action === 'TYPING') {
      if (data.bol) {
        socket.to(room).emit("data", { action: 'OPP_TYPING', bol: true });
      }
      else { socket.to(room).emit("data", { action: 'OPP_TYPING', bol: false }); }
    }
    if (playAgainEmit) {
      playagain.push(socket.id);
      socket.to(room).emit("data", { playAgainRequest: "true" });
    }
    if (action === 'CHATMESSAGE') {
      socket.to(room).emit("data", { incomingMessages: data.chatMessages });
    }
    if (action === 'DETAILS_CHECKER') {
      if (data.token !== 'none' && data.token) {
        jwt.verify(data.token, JWT_KEY, function (err, decoded) {
          if (!err) {
            (async () => {
              const [user] = await userModel.find({ _id: decoded.id });
              socket.emit("data", { username: user.username, scores: user.scores })
            })();
          }

        })
      }
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
      if (data.token !== 'none') {
        jwt.verify(data.token, JWT_KEY, function (err, decoded) {
          if (err) console.log("CANT VERIFT");
          else {
            (async () => {
              const [user] = await userModel.find({ _id: decoded.id });
              if (!user.scores) user.scores = 0;
              user.scores = user.scores + 100;
              await user.save();
              socket.emit("data", { scores: user.scores });
            })();

          }
        });
      }
    }
  });
});
