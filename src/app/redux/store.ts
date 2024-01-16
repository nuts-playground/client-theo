import { configureStore } from "@reduxjs/toolkit";
import playerSlice from "./playerSlice";
import socketSlice from "./socketSlice";
import playersSlice from "./playersSlice";
import roomsSlice from "./roomsSlice";

export const store = configureStore({
    reducer: {
        player: playerSlice,
        playersStore: playersSlice,
        socketStore: socketSlice,
        roomsStore: roomsSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
