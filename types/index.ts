import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export interface ProviderProps {
    children: React.ReactNode;
}

export interface Player {
    id: string;
    name: string;
    location: string;
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
    players: Player[];
    isStart: boolean;
    currentTurn: string;
    winner: string;
    master: string;
}
