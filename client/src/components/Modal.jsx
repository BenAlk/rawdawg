import React from 'react'
import axios from 'axios'
import {useCookies} from 'react-cookie'
export const Modal = (props) => {
    
    const [cookies ,] = useCookies(["access_token"])

    const remove = async (link) => {
        try {
                const headers = { authorization: cookies.access_token || '' }
                const response = await axios.delete(link, { headers })
                console.log(response)
                props.onClose()
            } catch (err) {
                console.log(err)
            }
    }

    const handleConfirm = () => {
        if (props.type.itemType === "dog"){
            remove(`https://rawdawg.onrender.com/config/pack/${props.type.item.userOwner}/dog/${props.type.item._id}`)
            props.setRefresh(true)
        } else if (props.type.itemType === "food item") {
            remove(`https://rawdawg.onrender.com/food/${props.type.item._id}/user/${props.type.userID}`)
            props.setRefresh(true)
        } else if (props.type.itemType === "calendar") {
            remove(`https://rawdawg.onrender.com/calendar/${props.type.item._id}`)
            props.setRefresh(true)
        } else 
        console.log("ERRORS!!!!")
    }

    console.log(props)
    return (
        <div onClick={props.onClose}className="overlay">
            <div onClick={(e) => {
                e.stopPropagation();
            }}
            className="modal-container">
                {props.type.itemType === "calendar" 
                ? <h4>Are you sure you wish to delete the {props.type.itemType} running from <span className="highlight">{new Date(props.type.item.dateStart).toLocaleDateString()}</span> until <span className="highlight">{new Date(props.type.item.dateEnd).toLocaleDateString()}</span> from your saved calendars?</h4> 
                : <h4>Are you sure you wish to delete the {props.type.itemType} called <span className="highlight">{props.type.item.name}</span> from your {props.type.itemType==="dog" ? "pack?": "menu?"}</h4>}
                <div className="modal-button-container">
                    <button className="form-button"onClick={handleConfirm}>Confirm</button>
                    <button className="form-button" onClick={props.onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
