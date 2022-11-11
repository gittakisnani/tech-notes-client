import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'

import { useSendLogOutMutation } from '../features/auth/authApiSlice'

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/


const DashHeader = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [sendLogout, {
        isSuccess,
        isLoading,
        isError,
        error
    }] = useSendLogOutMutation()


    useEffect(() => {
        if(isSuccess) navigate('/')
    }, [isSuccess, navigate])

    if(isLoading) return <p>Logging out...</p>
    if(isError) return <p>ERROR: {error.data?.message}</p>

    let dashClass = null;
    if([!DASH_REGEX.test(pathname), !NOTES_REGEX.test(pathname), !USERS_REGEX.test(pathname)].every(Boolean)) {
        dashClass = "dash-header__container--small"
    }

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    const content = (
        <header className="dash-header">
            <div className={`dash-header__container ${dashClass}`}>
                <Link to="/dash">
                    <h1 className="dash-header__title">techNotes</h1>
                </Link>
                <nav className="dash-header__nav">
                    {/* add nav buttons later */}
                    {logoutButton}
                </nav>
            </div>
        </header>
    )

    return content
}
export default DashHeader