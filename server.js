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
            console.log(player);
            socket.to(player.id).emit("sendRoom", user.room);
        });
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

    socket.on("enter", (playerName) => {
        user.name = playerName;
        sendRooms();
    });

    console.log("연결", socket.id);

    socket.on("getRoom", () => {
        console.log("입장");
        socket.emit("getRoom", rooms);
    });

    socket.on("createRoom", (roomData) => {
        console.log(roomData.boardData);
        const room = {
            id: Date.now(),
            name: roomData.roomName,
            players: [{ id: socket.id, name: roomData.player, isReady: false }],
            isStart: false,
            boardData: roomData.boardData,
        };
        rooms.push(room);
        user.room = room;
        sendRoom();
    });

    socket.on("joinRoom", (roomData) => {
        const roomIndex = rooms.findIndex((room) => room.id === roomData.id);
        if (rooms[roomIndex].players.length < 2) {
            rooms[roomIndex].players.push({
                id: user.id,
                name: roomData.player,
                isReady: false,
            });
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
