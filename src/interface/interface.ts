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

export interface IRoom {
    [key: string]: string | number | object | boolean;
    id: number;
    name: string;
    game: string;
    players: IPlayers;
    isStart: boolean;
    boardData: IGameCell[][];
    currentTurn: string;
    winner: string;
    master: string;
}

export interface IRooms {
    [key: string]: IRoom[];
}
