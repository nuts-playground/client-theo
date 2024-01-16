import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { IPlayer } from "@/interface/interface";

const initialState = {
    players: [] as IPlayer[],
};

export const players = createSlice({
    name: "playersStore",
    initialState,
    reducers: {
        setPlayers: (state, { payload }) => {
            state.players = payload.players;
        },
    },
});

export const { setPlayers } = players.actions;

export const selectPlayers = (state: RootState) => state.playersStore.players;

export default players.reducer;
