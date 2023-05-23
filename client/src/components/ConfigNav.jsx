import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export const ConfigNav = () => {

    const activeStyles = {
        fontWeight: 'bold',
        textDecoration: 'underline',
        color: '#161616'
    }

    return (
        <>
            <nav className="host-nav">
                <NavLink
                    to="."
                    end
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="AddDog"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Add Dog
                </NavLink>
                <NavLink
                    to="food"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Add Food
                </NavLink>
            </nav>
            <Outlet />
        </>
    )
}