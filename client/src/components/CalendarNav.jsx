import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export const CalendarNav = () => {

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
                    Saved Calendars
                </NavLink>
                <NavLink
                    to="AddCalendar"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Create New Calendar
                </NavLink>
            </nav>
            <Outlet />
        </>
    )
}