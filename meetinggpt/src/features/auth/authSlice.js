import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null,id:null ,expiresIn:null},
    reducers: {
        setCredentials: (state, action) => {
            const { id, token ,expiresIn} = action.payload;
            localStorage.setItem('token', token);
            localStorage.setItem('id', id);
            localStorage.setItem('expiresIn', expiresIn);

            
            return { ...state, id: id, token: token,expiresIn: expiresIn };
          }

          ,
        logOut: (state, action) => {
            localStorage.clear();
            state.token = null
            state.id = null
            state.expiresIn = null
        },
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentId = (state) => state.auth.id