const app = require("express")();
const dotenv = require("dotenv");
const log = require("@ajar/marker");
const cors = require("cors");
const {
    Server
} = require("socket.io");
dotenv.config();
const {
    CLIENT_URL
} = process.env;
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;
app.use(cors());
app.use("*", (req, res) => res.send("hello from express"));
const http = require("http").createServer(app);
(async() => {
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
    io.emit("data", {
        users_count: users
    });
    // player disconnected.
    socket.on("disconnect", function() {
        if (playagain.includes(socket.id)) {
            playagain.splice(playagain.indexOf(socket.id), 1);
        } else {
            let room = clients[socket.id];
            socket.to(room).emit("data", {
                leave: leave
            });
            delete rooms[room];
        }
        users--;
        io.emit("data", {
            users_count: users
        });
    });
    socket.on("data", (data = {}) => {
        const {
            room,
            action,
            board,
            turn,
            to_player,
            ships,
            guess,
            message,
            is_winning,
            play_again_emit,
        } = data;
        if (play_again_emit) {
            playagain.push(socket.id);
            socket.to(room).emit("data", {
                wanna_play_again: "wanna_play_again"
            });
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
                io.in(room).emit("data", {
                    other_player_connected: true
                });
            }
        }
        // ready - sends the players board and turn to the other player
        if (action === READY) {
            if (to_player === "1") {
                socket.to(room).emit("data", {
                    board,
                    ships,
                    turn,
                    to_player
                });
                // if both players are ready - start the game
                io.in(room).emit("data", {
                    ready_to_start: true
                });
            } else {
                socket.to(room).emit("data", {
                    board,
                    ships,
                    turn,
                    to_player
                });
            }
        }
        // guess - sending a guess to the other player
        if (guess) {
            socket.to(room).emit("data", {
                guess
            });
        }
        // is_winning - if one of the players won, notify the players
        if (is_winning) {
            socket.to(room).emit("data", {
                is_winning
            });
            rooms[room] = [];
        }
    });
});
