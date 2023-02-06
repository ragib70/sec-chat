import { configureStore } from "@reduxjs/toolkit";
import { messageSliceReducer } from "./slices/messageSlice";

export const store  = configureStore({
    reducer: {
        messages: messageSliceReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;