import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { IRoom } from "@/interface/interface";

const initialState = {
    rooms: [] as IRoom[],
};

export const rooms = createSlice({
    name: "roomsStore",
    initialState,
    reducers: {
        setRooms: (state, { payload }) => {
            state.rooms = payload.rooms;
            console.log(state);
        },
    },
});

export const { setRooms } = rooms.actions;

export const selectRooms = (state: RootState) => state.roomsStore.rooms;

export default rooms.reducer;
