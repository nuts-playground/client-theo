import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { IPlayer } from "@/interface/interface";

const initialState: IPlayer = {
    id: "",
    name: "",
    isReady: false,
    location: "",
};

export const player = createSlice({
    name: "player",
    initialState,
    reducers: {
        setPlayer: (state, { payload }) => {
            Object.keys(payload).forEach((key) => {
                state[key] = payload[key];
            });
        },
    },
});

export const { setPlayer } = player.actions;

export const selectPlayer = (state: RootState) => state.player;

export default player.reducer;
