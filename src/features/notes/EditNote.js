import { useSelector } from "react-redux"
import { getAllUsers } from "../users/usersApiSlice"
import { getNotesById } from "./notesApiSlice"
import { useParams } from "react-router"
import EditNoteForm from "./EditNoteForm"

const EditNote = () => {
    const { id } = useParams()
    const users = useSelector(getAllUsers);
    const note = useSelector(state => getNotesById(state, id))

    const content = note && users ? <EditNoteForm users={users} note={note} /> : <p>Loading...</p>
    return content
}

export default EditNote