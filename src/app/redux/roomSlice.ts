import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type RootState } from "./store";
import { IRoom } from "@/interface/interface";

const initialState = {} as IRoom;

export const room = createSlice({
    name: "roomStore",
    initialState,
    reducers: {
        setRoom: (state, { payload }) => {
            Object.keys(payload).forEach((key) => {
                state[key] = payload[key];
            });
        },
        updateBoard: (state, { payload }: PayloadAction<any>) => {
            console.log(state.currentTurn);
            if (
                state.boardData[payload.y][payload.x].value ||
                state.currentTurn !== payload.player.name
            )
                return;

            state.boardData[payload.y][payload.x].value = true;
            state.boardData[payload.y][payload.x].player =
                state.master === payload.player.name ? "O" : "X";
            state.currentTurn =
                state.currentTurn ===
                state.players[Object.keys(state.players)[0]].name
                    ? state.players[Object.keys(state.players)[1]].name
                    : state.players[Object.keys(state.players)[0]].name;

            // state.winner = checkGameOver(state.boardData);
        },
    },
});

export const { setRoom, updateBoard } = room.actions;

export const selectRoom = (state: RootState) => state.roomStore;

export default room.reducer;
