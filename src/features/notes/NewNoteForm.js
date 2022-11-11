import { useCreateNoteMutation } from "./notesApiSlice"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"


const NewNoteForm = ({ users }) => {
    const [createNote, {
        isSuccess, 
        isError, 
        isLoading, 
        error
    }] = useCreateNoteMutation();

    const navigate = useNavigate();

    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [userId, setUserId] = useState(users[0]?.id);

    useEffect(() => {
        if(isSuccess) {
            setTitle('');
            setText('');
            setUserId(users[0].id);
            navigate('/dash/notes')
        }
    }, [isSuccess, navigate]);

    const onTitleChange = e => setTitle(e.target.value);
    const onTextChange = e => setText(e.target.value);
    const onUserIdChange = e => setUserId(e.target.value);

    const canSave = [title, text, userId].every(Boolean) && !isLoading;


    const onSaveBtnClicked = async (e) => {
        e.preventDefault();
        if(canSave) {
            await createNote({ title, text, user: userId })
        }
    }

    const options = users.map(user => (
        <option
        key={user.id}
        value={user.id}
        >
            {user.username}
        </option>
    ))

    const errClass = isError ? "errmsg" : "offscreen"
    const validTitleClass = !title ? "form__input--incomplete" : ''
    const validTextClass = !text ? "form__input--incomplete" : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveBtnClicked}>
                <div className="form__title-row">
                    <h2>New Note</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="title">
                    Title:</label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChange}
                />

                <label className="form__label" htmlFor="text">
                    Text:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="text"
                    name="text"
                    value={text}
                    onChange={onTextChange}
                />

                <label className="form__label form__checkbox-container" htmlFor="username">
                    ASSIGNED TO:</label>
                <select
                    id="username"
                    name="username"
                    className="form__select"
                    value={userId}
                    onChange={onUserIdChange}
                >
                    {options}
                </select>

            </form>
        </>
    )
  return content
}

export default NewNoteForm