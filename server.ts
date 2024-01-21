import { player } from "./src/app/redux/playerSlice";
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
const connectedId: string[] = [];

io.on("connection", (socket) => {
    let room: IRoom = {} as IRoom;
    connectedId.push(socket.id);
    console.log(`${connectedId.length}명 접속 중`);

    const sendPlayers = () => {
        connectedId.forEach((id) => socket.to(id).emit("sendPlayers", players));
        socket.emit("sendPlayers", players);
        console.log(connectedId);
        console.log(`${connectedId.length}명에게 ${players.length}명 보냄`);
    };

    const sendRooms = () => {
        connectedId.forEach((id) => socket.to(id).emit("sendRooms", rooms));
        socket.emit("sendRooms", rooms);
    };

    socket.on("getPlayers", () => {
        socket.emit("sendPlayers", players);
    });

    socket.on("joinPlayground", (playerName) => {
        const hasPlayer = players.some((player) => player.name === playerName);
        if (hasPlayer) {
            socket.emit("joinPlayground", false);
            return false;
        }

        const newPlayer: IPlayer = {
            id: socket.id,
            name: playerName,
            isReady: false,
            location: "Lobby",
        };
        players.push(newPlayer);
        sendPlayers();
        socket.emit("joinPlayground", newPlayer);
        socket.emit("sendRooms", rooms);
    });

    const sendRoom = () => {
        Object.keys(room.players).forEach((id) => {
            socket.to(id).emit("sendRoom", room);
        });
        socket.emit("sendRoom", room);
    };

    const exitRoom = () => {
        if (!room.id) return false;
        delete room.players[socket.id];
        if (!room.players.length) {
            const roomIndex = rooms.findIndex((item) => item.id === room.id);
            rooms.splice(roomIndex);
        }
    };

    socket.on("getRoom", () => socket.emit("getRoom", rooms));

    socket.on("ready", (isReady) => {
        if (!room.id) return false;
        room.players[socket.id].isReady = isReady;
        sendRoom();
    });

    socket.on("createRoom", (roomData) => {
        const players = {} as any;
        players[roomData.player.id] = roomData.player;
        const newRoom = {
            id: Date.now(),
            name: roomData.name,
            players: players,
            isStart: false,
            boardData: roomData.boardData,
            currentTurn: roomData.currentTurn,
            winner: "",
            master: roomData.player.name,
        };
        room = newRoom;
        rooms.push(room);
        sendRoom();
        sendRooms();
    });

    socket.on("joinRoom", (roomData) => {
        const roomIndex = rooms.findIndex((room) => room.id === roomData.id);

        if (Object.keys(rooms[roomIndex].players).length < 2) {
            rooms[roomIndex].players[roomData.player.id] = roomData.player;
            room = rooms[roomIndex];
            sendRoom();
        }
        sendRooms();
    });

    socket.on("exitRoom", () => exitRoom());

    socket.on("sendRoom", (roomData) => {
        room = roomData;
        sendRoom();
    });

    socket.on("getRooms", () => sendRooms());

    socket.on("disconnect", () => {
        console.log("유저 제거");
        const playerIndex = players.findIndex(
            (player) => player.id === socket.id
        );

        const idIndex = connectedId.findIndex((id) => id === socket.id);
        console.log(connectedId);
        connectedId.splice(idIndex);
        players.splice(playerIndex);
        sendPlayers();
        exitRoom();
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`${PORT} 포트에서 socket.io 서버 실행중`);
});
