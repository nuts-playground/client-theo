import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { IPlayer } from "@/interface/interface";

// Define the initial state using that type
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
            state.id = payload.id;
            state.name = payload.name;
            state.isReady = payload.isReady;
            state.location = payload.location;
        },
    },
});

export const { setPlayer } = player.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPlayer = (state: RootState) => state.player;

export default player.reducer;
