import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: resData => {
                const loadedUsers = resData.map(user => {
                    user.id = user._id;
                    return user
                })

                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (res, error, arg) => {
                if(res.ids) {
                    return [
                        { type: 'User', id: 'LIST'},
                        ...res.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{type: 'User', id: 'LIST' }]
            }
        }),
        addUser: builder.mutation({
            query: initialUser => ({
                url: '/users',
                method: 'POST',
                body: {
                    ...initialUser
                }
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST'}]
        }),
        updateUser: builder.mutation({
            query: userData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...userData
                }
            }), 
            invalidatesTags: (res, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/users',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (res, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        })
    })
})

export const {
    useGetUsersQuery,
    useAddUserMutation, 
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApiSlice

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

export const selectUsersData = createSelector(
    selectUsersResult,
    user => user.data
)

export const {
    selectAll: getAllUsers,
    selectById: getUserById,
    selectIds: getUsersIds

} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)