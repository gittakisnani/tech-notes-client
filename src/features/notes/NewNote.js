import { useSelector } from "react-redux";
import { getAllUsers } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";
const NewNote = () => {
    const users = useSelector(getAllUsers)
    const content = users ? <NewNoteForm users={users} /> : <p>Loading...</p>;

    return content
}

export default NewNote