import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: {
                    ...credentials
                }
            })
        }),
        sendLogOut: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                // const { data } = (await queryFulfilled).data
                await queryFulfilled;
                dispatch(logOut());
                setTimeout(() => {
                    dispatch(apiSlice.util.resetApiState())
                }, 1000)
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: "/auth/refresh",
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled}) {
                const { data } = await queryFulfilled;
                console.log(data)
                const { accessToken } = data
                dispatch(setCredentials({ accessToken }))
            }
        })
    })
})

export const {
    useLoginMutation, 
    useSendLogOutMutation, 
    useRefreshMutation
} = authApiSlice