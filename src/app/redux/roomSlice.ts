import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type RootState } from "./store";
import { Room, TictactoeRoom } from "@/interface/interface";

const initialState = {} as Room;

export const room = createSlice({
    name: "roomStore",
    initialState,
    reducers: {
        setRoom: (state, { payload }) => {
            Object.keys(payload).forEach((key) => {
                state[key] = payload[key];
            });

            switch (payload.game) {
                case "tictactoe":
                    state as TictactoeRoom;
            }
            console.log(payload);
        },
    },
});

export const { setRoom } = room.actions;

export const selectRoom = (state: RootState) => state.roomStore;

export default room.reducer;
