import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getNotes: builder.query({
            query: () => '/notes',
            validateStatus: (res, result) => {
                return res.status === 200 && !result.isError
            },
            transformResponse: resData => {
                const loadedNotes = resData.map(note => {
                    note.id = note._id;
                    return note
                })

                return notesAdapter.setAll(initialState, loadedNotes)
            },
            providesTags: (result, err, args) => {
                if(result?.ids) {
                    return [
                        { type: 'Note', id: 'LIST'},
                        ...result.ids.map(id => ({ type: 'Note', id }))
                    ]
                } else return [{ type: 'Note', id: 'LIST'}]
            }
        }),
        createNote: builder.mutation({
            query: initialNote => ({
                url: '/notes',
                method: 'POST',
                body: {
                    ...initialNote
                }
            }),
            invalidatesTags: [
                {type: 'Note', id: 'LIST'}
            ]
        }),
        updateNote: builder.mutation({
            query: noteData => ({
                url: '/notes',
                method: 'PATCH',
                body: {
                    ...noteData
                }
            }),
            invalidatesTags: (res, error, arg) => [
                {
                    type: 'Note',
                    id: arg.id
                }
            ]
        }),
        deleteNote: builder.mutation({
            query: ({ id }) => ({
                url: '/notes',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (res, error, arg) => [
                {
                    type: 'Note',
                    id: arg.id
                }
            ]
        })
    })
})

export const {
    useGetNotesQuery,
    useCreateNoteMutation,
    useDeleteNoteMutation,
    useUpdateNoteMutation
} = notesApiSlice

export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

export const selectNotesData = createSelector(
    selectNotesResult,
    note => note.data
)

export const {
    selectAll: getAllNotes,
    selectById: getNotesById,
    selectIds: getNotesIds
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState)