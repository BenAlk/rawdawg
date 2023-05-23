import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useGetUserID } from '../hooks/useGetUserID.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { Modal } from '../components/Modal'
import {useCookies} from 'react-cookie'

export const Calendar = () => {

    const [calendarArray, setCalendarArray] = useState([])
    const userID = useGetUserID()
    const [openModal, setOpenModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState({})
    const [refresh, setRefresh] = useState(false)
    const today = new Date().toLocaleDateString()
    const [cookies ,] = useCookies(["access_token"])

    useEffect(() => {
        const fetchUpdatedCalendars = async () => {
            try {
            const updatedCalendars = await axios.get(
                `http://localhost:3001/calendar/${userID}`, {  headers: {authorization: cookies.access_token }}
            )
            if (JSON.stringify(updatedCalendars.data.savedCalendars) !== JSON.stringify(calendarArray)) {
                setCalendarArray(updatedCalendars.data.savedCalendars)
            }
            } catch(err) {
                console.log(err)
            }
        }
        console.log(calendarArray)
        fetchUpdatedCalendars()
        setRefresh(false)
        }, [userID, calendarArray, refresh, cookies.access_token])

    const handleSetModal = (itemType, item) => {
        setOpenModal(true)
        setSelectedItem({itemType, item, userID})
    }

const menuElement = () => {
    if (calendarArray.length > 0) {
        return (
            <>
                {calendarArray.map((calendar) => (    
                        
                            <div className="calendar-container calendar-edit-container" key={calendar._id}>
                                <div className={calendar.dogs.some((dog) => dog.dates.some((date) => new Date(date.date).toLocaleDateString() === today)) ? "active green" : new Date(calendar.dateEnd).toLocaleDateString() < today ? "red expired" : " " }>
                                    From {new Date(calendar.dateStart).toLocaleDateString()} To {new Date(calendar.dateEnd).toLocaleDateString()}
                                </div>
                                <div className="form-button-container">
                                        <Link 
                                            to={`Edit/${calendar._id}`}
                                        >
                                            <div className="form-button" title="Edit Calendar">
                                                <FontAwesomeIcon icon={faPenToSquare} title="Edit Calendar"/>
                                            </div>
                                        </Link>
                                        {calendar.completed === true ? <Link
                                            to={`/Calendar/OrderSheet/${calendar._id}`}
                                            
                                        >
                                            <div className="form-button" title="View OrderSheet" >
                                                <FontAwesomeIcon icon={faClipboardList} title="View OrderSheet"/>
                                            </div>
                                        </Link> : null }
                                    <div className="form-button" onClick={() => handleSetModal("calendar", calendar)} title="Delete Calendar">
                                        <FontAwesomeIcon icon={faTrash} title="Delete Calendar" />
                                    </div>
                                </div>
                            </div>
                        
                        
                ))}
            </>
        )
    }
}

console.log(calendarArray)

    return (
        <div className="calendar-list-container">
            <h1>{calendarArray.length > 0 ? "Your saved calendars" : "You have no saved calendars"}</h1>
            {calendarArray.length > 0 && menuElement()}
            {openModal ? <Modal type={selectedItem} open={openModal} onClose={ () => { setOpenModal(false); setRefresh(true)}} setRefresh={setRefresh} /> : null}
        </div>
    )

}