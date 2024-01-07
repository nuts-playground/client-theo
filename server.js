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

const tictactoe = [];

io.on("connection", (socket) => {
    console.log("연결", socket.id);
    socket.on("getRoom", () => {
        console.log("입장");
        socket.emit("getRoom", tictactoe);
    });

    socket.on("createRoom", (roomData) => {
        tictactoe.push({
            id: Date.now(),
            name: roomData.roomName,
            players: [roomData.player],
        });
        socket.emit("getRoom", tictactoe);
    });

    socket.on("disconnect", () => {
        console.log("연결 해제", socket.id);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`${PORT} 포트에서 socket.io 서버 실행중`);
});
