import { useState, useRef, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { getCurrentToken } from './authSlice'
import { useSelector } from 'react-redux'
import usePersist from '../../hooks/usePersist'
import { useRefreshMutation } from './authApiSlice'

const PersistLogin = () => {
    const [persist] = usePersist();
    const token = useSelector(getCurrentToken)
    const effectRan = useRef(false)
    const [trueSuccess, setTrueSuccess] = useState(false);

    const [refresh, {
        isUninitialized,
        isSuccess, 
        isLoading,
        isError, 
        error
    }
    ] = useRefreshMutation()

    useEffect(() => {
        if(effectRan.current === true || process.env.NODE_ENV === 'development') {
            const verifyRefreshToken = async () => {
                try {
                    await refresh();

                    setTrueSuccess(true)
                } catch(err) {
                    console.error(err)
                }
            }

            if(!token && persist) verifyRefreshToken();
        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])


    let content
    if (!persist) { // persist: no
        console.log('no persist')
        content = <Outlet />
    } else if (isLoading) { //persist: yes, token: no
        console.log('loading')
        content = <p>Loading...</p>
    } else if (isError) { //persist: yes, token: no
        console.log('error')
        content = (
            <p className='errmsg'>
                {error.data?.message}
                <Link to="/login">Please login again</Link>.
            </p>
        )
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    }

    return content

    return content
  
}

export default PersistLogin