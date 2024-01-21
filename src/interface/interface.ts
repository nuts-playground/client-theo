import { IGameCell } from "@/components/gameBoard";

export interface IPlayer {
    [key: string]: any;
    id: string;
    name: string;
    isReady: boolean;
    location: "Lobby" | "";
}

export interface IRoom {
    [key: string]: any;
    id: number;
    name: string;
    players: {
        [key: string]: IPlayer;
    };
    isStart: boolean;
    boardData: IGameCell[][];
    currentTurn: string;
    winner: string | "drow" | "";
    master: string;
}
