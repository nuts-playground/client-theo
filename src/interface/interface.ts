import { IGameCell } from "@/components/gameBoard";

export interface IPlayer {
    id: string;
    name: string;
    isReady: boolean;
}

export interface IRoom {
    id: number;
    name: string;
    players: IPlayer[];
    isStart: boolean;
    boardData: IGameCell[][];
    currentTurn: string | undefined;
}
