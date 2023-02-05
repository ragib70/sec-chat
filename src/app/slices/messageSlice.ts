import { IMessageIPFS } from "@pushprotocol/restapi/src/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../types";


const initialState: {
    conversation: {[key: string]: IMessageIPFS[]}
} = {
    conversation: {}
};

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        update: (state, action: PayloadAction<{conversationId: string; messages: IMessageIPFS[]}> ) =>{
            state.conversation[action.payload.conversationId] = action.payload.messages.sort((a, b)=> ((a.timestamp || 0) - (b.timestamp || 0)));
        }
    }
})

export const updateMessages = messageSlice.actions.update;
export const  messageSliceReducer = messageSlice.reducer;