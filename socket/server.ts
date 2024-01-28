import http from "http";
import { Server } from "socket.io";
import { IPlayer, IPlayers, IRoom } from "@/interface/interface";
import { IGameCell } from "@/components/gameBoard";

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

const checkGameOver = (
    marker: string,
    player: IPlayer,
    boardData: IGameCell[][]
) => {
    const lineArray = [
        // 가로 3줄
        [boardData[0][0], boardData[0][1], boardData[0][2]],
        [boardData[1][0], boardData[1][1], boardData[1][2]],
        [boardData[2][0], boardData[2][1], boardData[2][2]],
        // 세로 3줄
        [boardData[0][0], boardData[1][0], boardData[2][0]],
        [boardData[0][1], boardData[1][1], boardData[2][1]],
        [boardData[0][2], boardData[1][2], boardData[2][2]],
        // 대각선 2줄
        [boardData[0][0], boardData[1][1], boardData[2][2]],
        [boardData[0][2], boardData[1][1], boardData[2][0]],
    ];
    for (let i = 0; i < lineArray.length; i++) {
        console.log(lineArray[i]);
        if (lineArray[i].every((item) => item.player === marker)) {
            return player.name;
        }
    }

    let cellArray = boardData.reduce(function (
        prev: IGameCell[],
        next: IGameCell[]
    ) {
        return prev.concat(next);
    });

    if (cellArray.every((cell: IGameCell) => cell.value)) {
        return "drow";
    }

    return "";
};

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
        if (room.id) {
            Object.keys(room.players).forEach((id) => {
                socket.to(id).emit("sendRoom", room);
            });
        }

        socket.emit("sendRoom", room);
    };

    const exitRoom = () => {
        if (!room.id) return false;
        delete room.players[socket.id];
        if (!Object.keys(room.players).length) {
            const roomIndex = rooms.findIndex((item) => item.id === room.id);
            rooms.splice(roomIndex);
        } else {
            sendRoom();
            room = {} as IRoom;
            sendRoom();
        }
    };

    socket.on("getRoom", () => socket.emit("getRoom", rooms));

    socket.on("ready", (isReady) => {
        if (!room.id) return false;
        room.players[socket.id].isReady = isReady;
        sendRoom();
    });

    socket.on("createRoom", (roomData) => {
        const players: IPlayers = {};
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

    socket.on("turnEnd", (data) => {
        if (
            data.room.boardData[data.y][data.x].value ||
            data.room.currentTurn !== data.player.name
        )
            return;

        data.room.boardData[data.y][data.x].value = true;
        data.room.boardData[data.y][data.x].player =
            data.room.master === data.player.name ? "O" : "X";
        data.room.winner = checkGameOver(
            data.room.boardData[data.y][data.x].player,
            data.player,
            data.room.boardData
        );
        data.room.currentTurn =
            data.room.currentTurn ===
            data.room.players[Object.keys(data.room.players)[0]].name
                ? data.room.players[Object.keys(data.room.players)[1]].name
                : data.room.players[Object.keys(data.room.players)[0]].name;

        room = data.room;
        sendRoom();
    });

    socket.on("resetRoom", (boardData: IGameCell[][]) => {
        room.boardData = boardData;
        room.winner = "";
        room.currentTurn = room.master;
        sendRoom();
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
