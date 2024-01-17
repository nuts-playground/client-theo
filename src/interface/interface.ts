import { IGameCell } from "@/components/gameBoard";

export interface IPlayer {
    id: string;
    name: string;
    isReady: boolean;
    location: "Lobby" | "";
}

export interface IRoom {
    [key: string]: any;
    id: number;
    name: string;
    players: IPlayer[];
    isStart: boolean;
    boardData: IGameCell[][];
    currentTurn: string;
    winner: string | "drow" | "";
}
