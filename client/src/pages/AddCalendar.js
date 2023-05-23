import React, {useState, useEffect} from 'react'
import { DateRange } from "react-date-range"
import { useNavigate } from 'react-router-dom'
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import axios from 'axios'
import { useGetUserID } from '../hooks/useGetUserID.js'
import { useCookies } from 'react-cookie'

export const AddCalendar = () => {
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [newCalendar, setNewCalendar] = useState({})
    const [dogList, setDogList] = useState([])
    const userID = useGetUserID()
    const navigate = useNavigate()
    const [cookies ,] = useCookies(["access_token"])


    const getDogList = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3001/config/pack/${userID}`, {  headers: {authorization: cookies.access_token }}
            )
            setDogList(response.data.dogs)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getDogList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: "selection",
    }

    const handleSelect = (ranges) => {
        setStartDate(ranges.selection.startDate)
        setEndDate(ranges.selection.endDate)
    }

    const createNewCalendar = (startDate, endDate, dogList, userID, setNewCalendar) => {
        const dates = []
        let currentDate = new Date(startDate)

        while (currentDate <= endDate)
        {
            dates.push({
                date: new Date(currentDate),
                menuItems: 
                    {
                        foodId1: null,
                        weight1: null,
                        foodId2: null,
                        weight2: null
                    }
            })
            currentDate.setDate(currentDate.getDate() + 1)
        }

        const dogs = dogList.map(dog => ({
            name: dog.name,
            mealweight: dog.mealweight,
            meals: dog.meals,
            dogId: dog._id,
            dates: dates.map(date => ({
                date: date.date,
                menuItems: {
                    foodId1: userID,
                    weight1: 0,
                    foodId2: userID,
                    weight2: 0
                }
            }))
        }))

        const calendar = {
            dateStart: startDate,
            dateEnd: endDate,
            dogs,
            userOwner: userID,
            completed: false,
        }
        return calendar 
    } 

    useEffect(() => {
        const postNewCalendar = async () => {
            try{
                await axios.post("http://localhost:3001/calendar", newCalendar, {  headers: {authorization: cookies.access_token }})
                console.log(newCalendar)
                navigate("/Calendar")
            }   catch(err){
                console.error(err)
            }
        }

        if (Object.keys(newCalendar).length > 0) {
            postNewCalendar()
        }   

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[newCalendar])

    const handleSubmit = () => {
        if(dogList.length === 0){
            alert("Add a dog to your pack before creating a calendar!")
        } else {
            const calendar = createNewCalendar(startDate, endDate, dogList, userID);
            setNewCalendar(calendar);
        }
    }


return (
        <>
        <div className="search">
                    <h3>Please select a range of dates:</h3>
                    <DateRange ranges={[selectionRange]} onChange={handleSelect} />
                    <button className="form-button" onClick={handleSubmit}>Confirm Dates</button>
                </div>
        </>
    )
    
}