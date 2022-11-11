import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
const EditNoteForm = ({ users, note}) => {
    const navigate = useNavigate();
    const [updateNote, {
        isSuccess, 
        isLoading,
        isError, 
        error
    }] = useUpdateNoteMutation()

    const [deleteNote, {
        isSuccess: isDelSuccess, 
        isLoading: isDelLoading,
        isError: isDelError,
        error: delError
    }] = useDeleteNoteMutation();


    const [newTitle, setNewTitle] = useState(note.title);
    const [newText, setNewText] = useState(note.text);
    const [newUserId, setNewUserId] = useState(note.user)
    const [completed, setCompleted] = useState(note.completed);

    const onTitleChange = e => setNewTitle(e.target.value);
    const onNewTextChange = e => setNewText(e.target.value);
    const onNewUserIdChange = e => setNewUserId(e.target.value);
    const onCompletedChange = () => setCompleted(!completed);

    useEffect(() => {
        if(isSuccess || isDelSuccess) {
            setNewTitle('');
            setNewText('');
            setNewUserId(note?.user)
            navigate('/dash/notes')
        }
    }, [isDelSuccess, isSuccess, navigate])


    const canSave = [newUserId, newTitle, newText].every(Boolean) && !isLoading;

    const onSaveBtnClicked = async () => {
        if(canSave) {
            await updateNote({ id: note.id, title: newTitle, text: newText, user: newUserId, completed})
        }
    }

    const onDeleteBtnClicked = async () => {
        await deleteNote({ id: note.id })
    }

    const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const options = users.map(user => {
        return (
            <option
                key={user.id}
                value={user.id}

            > {user.username}</option>
        )
    })

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validTitleClass = !newTitle ? "form__input--incomplete" : ''
    const validTextClass = !newText ? "form__input--incomplete" : ''

    const errContent = (error?.data?.message || delError?.data?.message) ?? '';

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Note #{note.ticket}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveBtnClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteBtnClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="note-title">
                    Title:</label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="note-title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={newTitle}
                    onChange={onTitleChange}
                />

                <label className="form__label" htmlFor="note-text">
                    Text:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="note-text"
                    name="text"
                    value={newText}
                    onChange={onNewTextChange}
                />
                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="note-completed">
                            WORK COMPLETE:
                            <input
                                className="form__checkbox"
                                id="note-completed"
                                name="completed"
                                type="checkbox"
                                checked={completed}
                                onChange={onCompletedChange}
                            />
                        </label>

                        <label className="form__label form__checkbox-container" htmlFor="note-username">
                            ASSIGNED TO:</label>
                        <select
                            id="note-username"
                            name="username"
                            className="form__select"
                            value={newUserId}
                            onChange={onNewUserIdChange}
                        >
                            {options}
                        </select>
                    </div>
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                </div>
            </form>
        </>
    )
  return content
}

export default EditNoteForm