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
    const user = {
        id: socket.id,
        name: "",
        room: {},
    };

    const sendRoom = () => {
        console.log(user.room);
        user.room.players.forEach((player) => {
            console.log("이사람", player);
            socket.to(player.id).emit("sendRoom", user.room);
        });
        console.log("이걸 보내", user.room);
        socket.emit("sendRoom", user.room);
    };

    const updateRoom = () => {
        user.room.players.forEach((player) => {
            socket.to(player.id).emit("roomUpdate", user.room);
        });
        socket.emit("roomUpdate", user.room);
    };

    const sendRooms = () => {
        socket.emit("sendRooms", rooms);
    };

    const exitRoom = () => {
        if (!user.room.id) return false;

        const playerIndex = user.room.players.findIndex(
            (player) => player.id === socket.id
        );
        user.room.players.splice(playerIndex);
        if (!user.room.players.length) {
            const roomIndex = rooms.findIndex(
                (room) => room.id === user.room.id
            );
            rooms.splice(roomIndex);
        }
    };

    socket.on("getRoom", () => {
        console.log("입장");
        socket.emit("getRoom", rooms);
    });

    socket.on("createRoom", (room) => {
        const newRoom = {
            id: Date.now(),
            name: room.name,
            players: [room.player],
            isStart: false,
            boardData: room.boardData,
            currentTurn: room.currentTurn,
        };
        rooms.push(newRoom);
        user.room = newRoom;
        sendRoom();
    });

    socket.on("joinRoom", (roomData) => {
        const roomIndex = rooms.findIndex((room) => room.id === roomData.id);

        if (rooms[roomIndex].players.length < 2) {
            rooms[roomIndex].players.push(roomData.player);
            user.room = rooms[roomIndex];
            sendRoom();
        }
    });

    socket.on("exitRoom", () => exitRoom());

    socket.on("ready", (isReady) => {
        const playerIndex = user.room.players.findIndex(
            (player) => player.id === socket.id
        );
        user.room.players[playerIndex].isReady = isReady;
        updateRoom();
    });

    socket.on("start", () => {
        user.room.isStart = true;
        updateRoom();
    });

    socket.on("updateBoard", (boardData) => {
        user.room.boardData = boardData;

        updateRoom();
    });

    socket.on("sendRoom", (room) => {
        user.room = room;
        sendRoom();
    });

    socket.on("disconnect", () => {
        console.log("연결 해제", socket.id);
        exitRoom();
    });

    sendRooms();
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`${PORT} 포트에서 socket.io 서버 실행중`);
});
