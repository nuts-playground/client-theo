const http = require("http");
const { Server } = require("socket.io");

const httpServer = http.createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const rooms = [];

io.on("connection", (socket) => {
    console.log("연결", socket.id);
    socket.on("getRoom", () => {
        console.log("입장");
        socket.emit("getRoom", rooms);
    });

    socket.on("createRoom", (roomData) => {
        const room = {
            id: Date.now(),
            name: roomData.roomName,
            players: [roomData.player],
        };
        rooms.push(room);
        socket.emit("joinRoom", room);
    });

    socket.on("joinRoom", (data) => {
        const roomIndex = rooms.findIndex((room) => room.id === data.id);
        if (rooms[roomIndex].players.length < 2) {
            rooms[roomIndex].players.push(data.player);
            socket.emit("joinRoom", rooms[roomIndex]);
        } else {
            socket.emit("joinRoom", false);
        }
    });

    socket.on("exitRoom", (data) => {
        const roomIndex = rooms.findIndex((room) => room.id === data.id);
        const playerIndex = rooms[roomIndex].players.findIndex(
            (player) => player === data.player
        );
        rooms[roomIndex].players.splice(playerIndex);
        if (!rooms[roomIndex].players.length) rooms.splice(roomIndex);
    });

    socket.on("disconnect", () => {
        console.log("연결 해제", socket.id);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`${PORT} 포트에서 socket.io 서버 실행중`);
});
