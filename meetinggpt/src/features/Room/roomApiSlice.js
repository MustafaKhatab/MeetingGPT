import { apiSlice } from "../../app/api/apiSlice";

export const roomApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoom: builder.query({
      query: () => ({
        url: "/calls",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
    guestLogin: builder.mutation({
      query: (credentials) => ({
        url: "/users/guest",
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useGetRoomQuery ,useGuestLoginMutation} = roomApiSlice;
