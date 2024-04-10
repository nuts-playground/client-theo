import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export interface ProviderProps {
    children: React.ReactNode;
}

export interface User {
    id: string;
    username: string;
    location: string;
}

export interface GameType {
    id: string;
    name: string;
    minUsers: number;
    maxUsers: number;
}

export interface RoomPlayer extends User {
    isMaster: boolean;
    ready: boolean;
}

export interface ChatType {
    id: string;
    player: string;
    text: string;
    date: string;
}

export interface Room {
    [key: string]: string | number | object | boolean;
    id: number;
    name: string;
    players: RoomPlayer[];
    isStart: boolean;
    currentTurn: string;
    winner: string;
    state: "playing" | "waiting" | "full" | "canStart";
    master: string;
    data: any;
}
