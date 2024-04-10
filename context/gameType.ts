import { GameType } from "@/types";
import { createContext } from "react";

export const GameTypeContext = createContext<GameType | null>(null);
