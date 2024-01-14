import http from "http";
import { Server } from "socket.io";
import { IPlayer, IRoom } from "@/interface/interface";

const httpServer = http.createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const rooms: IRoom[] = [];
const players: IPlayer[] = [];

io.on("connection", (socket) => {
    let room: IRoom = {} as IRoom;

    const sendPlayers = () => {
        players.forEach((player) =>
            socket.to(player.id).emit("sendPlayers", players)
        );
        socket.emit("sendPlayers", players);
    };

    socket.on("joinPlayground", (playerName) => {
        const hasPlayer = players.some((player) => player.name === playerName);

        if (!hasPlayer) {
            players.push({
                id: socket.id,
                name: playerName,
                isReady: false, // TODO: 플레이어의 준비 상태는 room 객체에서 관리하도록 수정 필요
                location: "Lobby",
            });
            console.log("유저 등록 성공", players);
        }
        sendPlayers();
        socket.emit("joinPlayground", !hasPlayer);
    });

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
        room.winner = roomData.winner;

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

    socket.on("disconnect", () => {
        const playerIndex = players.findIndex(
            (player) => player.id === socket.id
        );
        players.splice(playerIndex);
        sendPlayers();
        exitRoom();
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`${PORT} 포트에서 socket.io 서버 실행중`);
});
