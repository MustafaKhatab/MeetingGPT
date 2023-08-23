import { apiSlice } from "../../app/api/apiSlice"
import { logOut } from "../auth/authSlice"

export const videoRoomApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        guestLogin: builder.mutation({
            
            query: credentials => ({
                url: '/users/guest',
                method: 'POST',
                body: { ...credentials }
            }),
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {  

                    const { data } = await queryFulfilled
                    console.log(data)
                    dispatch(logOut())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 2000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        sendTranscript: builder.mutation({
            query: ({ transcription, ROOM_ID }) => {
              return {
                url: `/calls/${ROOM_ID}`,
                method: 'POST',
                body: transcription,
              };
            },
          }),

    })
})

export const {
    useGuestLoginMutation,
    useSendLogoutMutation,
    useSendTranscriptMutation
} = videoRoomApiSlice 