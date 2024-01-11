import http from "http";
import { Server } from "socket.io";
import { IRoom } from "@/interface/interface";

const httpServer = http.createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const rooms: IRoom[] = [];

io.on("connection", (socket) => {
    let room: IRoom = {} as IRoom;

    const sendRoom = () => {
        room.players.forEach((player) => {
            socket.to(player.id).emit("sendRoom", room);
        });
        socket.emit("sendRoom", room);
    };

    const sendRooms = () => socket.emit("sendRooms", rooms);
    const exitRoom = () => {
        if (!room.id) return false;
        const playerIndex = room.players.findIndex(
            (player) => player.id === socket.id
        );
        room.players.splice(playerIndex);
        if (!room.players.length) {
            const roomIndex = rooms.findIndex((item) => item.id === room.id);
            rooms.splice(roomIndex);
        }
    };

    socket.on("getRoom", () => socket.emit("getRoom", rooms));

    socket.on("createRoom", (roomData) => {
        room.id = Date.now();
        room.name = roomData.name;
        room.players = [roomData.player];
        room.isStart = false;
        room.boardData = roomData.boardData;
        room.currentTurn = roomData.currentTurn;

        rooms.push(room);
        sendRoom();
    });

    socket.on("joinRoom", (roomData) => {
        const roomIndex = rooms.findIndex((room) => room.id === roomData.id);

        if (rooms[roomIndex].players.length < 2) {
            rooms[roomIndex].players.push(roomData.player);
            room = rooms[roomIndex];
            sendRoom();
        }
    });

    socket.on("exitRoom", () => exitRoom());

    socket.on("sendRoom", (roomData) => {
        room = roomData;
        sendRoom();
    });

    socket.on("getRooms", () => sendRooms());

    socket.on("disconnect", () => exitRoom());
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`${PORT} 포트에서 socket.io 서버 실행중`);
});
