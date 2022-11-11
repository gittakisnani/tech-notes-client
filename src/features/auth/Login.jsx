import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { useLoginMutation } from './authApiSlice';
import { setCredentials } from './authSlice';
import usePersist from '../../hooks/usePersist';


const Login = () => {
    const [persist, setPersist] = usePersist()

    const errRef = useRef();
    const userRef = useRef();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('')

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [username, password])

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const { accessToken } = await login({ username, password }).unwrap();
            dispatch(setCredentials({ accessToken }))
            setUsername('');
            setPassword('')
            navigate('/dash')
        } catch(err) {
            errRef.current.focus();
            if(!err.response) {
                setErrMsg('No server response')
            } else if (err.response.status === 400) {
                setErrMsg('Missing username or password')
            } else if (err.response.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg('Login failed')
            }
        }
    }

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handlePersist = () => setPersist(!persist)

    const errClass = errMsg ? "errmsg" : "offscreen"

    if(isLoading) return <p>Logging in...</p>
    
    const content = (
        <section className="public">
            <header>
                <h1>Employee Login</h1>

            </header>
            <main className="login">
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        className="form__input"
                        type="text"
                        id="username"
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        onChange={handlePwdInput}
                        value={password}
                        required
                    />

                    <label htmlFor="persist" className="form__persist">
                        <input
                            type="checkbox"
                            className="form__checkbox"
                            id="persist"
                            onChange={handlePersist}
                            checked={persist}
                        />
                        Trust This Device
                    </label>
                    <button className="form__submit-button">Sign In</button>
                </form>
            </main>
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    )

    return content
}
export default Login