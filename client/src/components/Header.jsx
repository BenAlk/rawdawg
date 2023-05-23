import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

export const Header = () => {
        const activeStyles = {
        fontWeight: 'bold',
        textDecoration: 'underline',
        color: '#DEDBD89A'
    }
    const [user, setUser] = useState(null)
    const [cookies, setCookies] = useCookies(["access_token"])
    const navigate = useNavigate()

    const logout = () => {
        setCookies("access_token", "")
        window.localStorage.removeItem("userID")
        navigate("/auth")
        setUser(null)
    }

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3001/auth/userCheck/${window.localStorage.getItem('userID')}`, {  headers: {authorization: cookies.access_token }})
                setUser(data)
            } catch (err) {
                console.log(err)
            }
        }
        if (cookies.access_token && !user) {
            checkUser()
        }
    }, [cookies.access_token, user]) 


    return (
        <header>
            <Link className="site-logo" to="/">RawDawg</Link>
            <nav>
                {/* <NavLink
                    to="/loadplan"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    Load Plan
    </NavLink> */}
                {user && (
                <NavLink
                    to="/Config"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    Config
                </NavLink>
                )}
                {user && (
                <NavLink
                    to="/Calendar"
                    style={({isActive}) => isActive ? activeStyles : null}
                >
                    Calendar
                </NavLink>
                )}
                {!cookies.access_token ? (<NavLink to="/Auth">Login</NavLink>) : <button className="logout" onClick={logout}>Logout</button> }
            </nav>
        </header>
    )
}