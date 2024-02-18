export interface IGameCell {
    player: string;
    value: boolean;
}

export interface Player {
    [key: string]: string | boolean;
    id: string;
    name: string;
    isReady: boolean;
    location: "로비" | "";
}

export interface Players {
    [key: string]: Player;
}

export type GameData = IGameCell[][] | GuessingData;

export interface Game {
    name: string;
    maxPlayers: number;
    minPlayers: number;
}

export interface Room {
    [key: string]: string | number | object | boolean;
    id: number;
    name: string;
    game: Game;
    players: Players;
    maxPlayer: number;
    isStart: boolean;
    boardData: GameData;
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
