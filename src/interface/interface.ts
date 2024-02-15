import { IGameCell } from "@/components/gameBoard";

export interface IPlayer {
    [key: string]: string | boolean;
    id: string;
    name: string;
    isReady: boolean;
    location: "로비" | "";
}

export interface IPlayers {
    [key: string]: IPlayer;
}

type RoomTypes = IGameCell[][] | GuessingData;

export interface Room {
    [key: string]: string | number | object | boolean;
    id: number;
    name: string;
    game: string;
    players: IPlayers;
    isStart: boolean;
    boardData: RoomTypes;
    currentTurn: string;
    winner: string;
    master: string;
}

export interface TictactoeRoom extends Room {
    boardData: IGameCell[][];
}

interface GuessingData {
    answer: string;
    history: [
        {
            question: string;
            answer: boolean;
        }
    ];
}

export interface GuessingRoom extends Room {
    boardData: GuessingData;
}

export interface Rooms {
    [key: string]: Room[];
}
