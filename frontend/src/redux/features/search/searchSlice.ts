import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SearchState{
    value:string
}
const initialState:SearchState={
    value:""
}



export const updateSlice= createSlice({
    name:'update',
    initialState,
    reducers:{
        update:(state, action:PayloadAction<string>)=>{
            state.value=action.payload
        }
    }
})
export const {update}=updateSlice.actions;
const updateReducer=updateSlice.reducer
export default updateReducer
