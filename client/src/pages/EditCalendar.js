import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetUserID } from '../hooks/useGetUserID'
import axios from 'axios'
import {useCookies} from 'react-cookie'

export const EditCalendar = () => {

    const calendarId = useParams()
    const [calendar, setCalendar] = useState([])
    const [foods, setFoods] = useState([])
    const userID = useGetUserID()
    const navigate = useNavigate()
    const [loaded, setLoaded] = useState(false)
    const [cookies ,] = useCookies(["access_token"])

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const [savedCalendar, foodList] = await Promise.all([
                axios.get(`http://localhost:3001/calendar/savedcalendars/${calendarId.id}`, {  headers: {authorization: cookies.access_token }}),
                axios.get(`http://localhost:3001/Food/${userID}`, {  headers: {authorization: cookies.access_token }})

            ]) 
                setCalendar(savedCalendar.data.calendar)
                setFoods(foodList.data.food)
                setLoaded(true)
            } catch (err) {
                console.log(err)
            }
        }
        fetchCalendar()
    }, [calendarId, userID, cookies.access_token])


    console.log(calendar)
    console.log(foods)

    const handleMenuItemChange = (dogId, date, menuItemId, field, value) => {
        setCalendar(prevCalendar => {
            const updatedDogs = prevCalendar.dogs.map(dog => {
                if (dog._id === dogId) {
                    const updatedDates = dog.dates.map(dateObj => {
                    if (dateObj.date === date && dateObj._id === menuItemId) {
                        dateObj.menuItems[field] = value
                    }
                    return dateObj
                    })
                    dog.dates = updatedDates
                }
            return dog
            })
            return {
                ...prevCalendar,
                dogs: [...updatedDogs]
            };
        });
    };

    const handleUpdateCalendar = async () => {
        try {
            
                const response = await axios.put(`http://localhost:3001/calendar/savecalendar/${calendarId.id}`, calendar, {  headers: {authorization: cookies.access_token }})
                console.log(response)
                alert("Changes have been saved successfully, any errors will be calculated upon submission.")
            }
        catch (err) {
            console.log(err)
        }
    }

    const handleSubmitCalendar = async () => {
        try {
            let weightError = []
            let menuItemError = []
            for(const dog of calendar.dogs){
                const mealweight = dog.mealweight
                console.log(mealweight)
                for(const date of dog.dates){
                    const weightOne = parseInt(date.menuItems.weight1)
                    const weightTwo = parseInt(date.menuItems.weight2)
                    const totalWeight = weightOne + weightTwo
                    if(totalWeight !== mealweight){
                        weightError.push(`${dog.name} has an error with meal weights on ${new Date(date.date).toLocaleDateString()}`)
                    }
                    if(date.menuItems.foodId1 === userID||date.menuItems.foodId2 === userID) {
                        menuItemError.push(`${dog.name} has an error with meal choices on ${new Date(date.date).toLocaleDateString()}`)
                    }
                }
            }
            if (weightError.length > 0 || menuItemError.length > 0){
                alert(weightError.join('\n') + ('\n') + menuItemError.join('\n'))
                weightError = []
                menuItemError = []
            } else
            {
                calendar.completed = true
                const response = await axios.put(`http://localhost:3001/calendar/savecalendar/${calendarId.id}`, calendar, {  headers: {authorization: cookies.access_token }})
                console.log(response)
                navigate(`/Calendar/OrderSheet/${calendarId.id}`)
            }
        } catch (err) {
            console.log(err)
        }
    }
    


    const menuElement = () => {

        const calculateTotalMealWeight = (dogId, date) => {
            const dog = calendar.dogs.find((dog) => dog._id === dogId);
            if (dog) {
                const currentDate = dog.dates.find((dateObj) => dateObj.date === date);
                if (currentDate) {
                    const weight1 = parseInt(currentDate.menuItems.weight1) || 0;
                    const weight2 = parseInt(currentDate.menuItems.weight2) || 0;
                    return weight1 + weight2;
                }
            }
            return 0;
        };


            const handleCopyFromPrevious = (dogId, currentDate, currentIndex) => {
                setCalendar(prevCalendar => {
                    const updatedDogs = prevCalendar.dogs.map(dog => {
                        if (dog._id === dogId) {
                        const updatedDates = dog.dates.map((dateObj, index) => {
                            if (index > 0 && dateObj.date === currentDate) {
                                const previousDateObj = dog.dates[index - 1];
                                dateObj.menuItems = {
                                    ...previousDateObj.menuItems
                                };
                            }
                            return dateObj;
                        });
                        dog.dates = updatedDates;
                        }
                        return dog;
                    });
                    return {
                        ...prevCalendar,
                        dogs: [...updatedDogs]
                    };
                });
            };

        
            return (
            <div className="container">
                <div className="calendar-pack-container">
                    {calendar.dogs.map((dog) => (
                    <div className="calendar-dog-container" key={dog._id}>
                        <h3>{dog.name}'s Menu</h3>
                        {dog.dates.map((date,index) => (
                        <div className="calendar-edit-container" key={date._id}>
                            <h3>{new Date(date.date).toLocaleDateString()}</h3>
                            <div className="date-menu-container">
                                <select
                                    name={`foodId1-${dog._id}-${date._id}`}
                                    value={date.menuItems.foodId1}
                                    onChange={(e) =>
                                        handleMenuItemChange(
                                            dog._id,
                                            date.date,
                                            date._id,
                                            "foodId1",
                                            (e.target.value)
                                        )
                                        }
                                >
                                    <option value={userID} disabled>
                                    - Choose your menu item
                                    </option>
                                    {foods.map((food) => (
                                    <option key={food._id} value={food._id}>
                                        {food.name}
                                    </option>
                                    ))}
                                </select>
                                <input
                                    name={`weightId1-${dog._id}-${date._id}`}
                                    className="menu-item-weight"
                                    type="number"
                                    placeholder="weight(g)"
                                    value={date.menuItems.weight1 > 0 ? date.menuItems.weight1 : 0}
                                    onChange={(e) =>
                                    handleMenuItemChange(
                                        dog._id,
                                        date.date,
                                        date._id,
                                        "weight1",
                                        e.target.value
                                    )
                                    }
                                />
                            </div>
                            <div className="date-menu-container">
                                <select
                                    name={`foodId2-${dog._id}-${date._id}`}
                                    value={date.menuItems.foodId2}
                                    onChange={(e) =>
                                    handleMenuItemChange(
                                        dog._id,
                                        date.date,
                                        date._id,
                                        "foodId2",
                                        (e.target.value)
                                    )
                                    }
                                >
                                    <option value={userID} disabled>
                                    - Choose your menu item
                                    </option>
                                    {foods.map((food) => (
                                    <option key={food._id} value={food._id}>
                                        {food.name}
                                    </option>
                                    ))}
                                </select>
                                <input
                                    name={`weightId2-${dog._id}-${date._id}`}
                                    className="menu-item-weight"
                                    type="number"
                                    placeholder="weight(g)"
                                    value={date.menuItems.weight2 > 0 ? date.menuItems.weight2 : 0}
                                    onChange={(e) =>
                                    handleMenuItemChange(
                                        dog._id,
                                        date.date,
                                        date._id,
                                        "weight2",
                                        e.target.value
                                    )
                                    }
                                />
                            </div>
                            <p className="target-text">Target meal weight : <span className={parseInt(calculateTotalMealWeight(dog._id, date.date)) === dog.mealweight ? "green" : "red"}>{dog.mealweight}</span>(g)</p>
                            <p className={`target-text ${index > 0 ? "" : "target-text-one"}`}>Total meal weight : <span className={parseInt(calculateTotalMealWeight(dog._id, date.date)) === dog.mealweight ? "green" : "red"}>{calculateTotalMealWeight(dog._id, date.date)}</span>(g)</p>  
                            {index > 0 && (
                                <button
                                    className="form-button"
                                    onClick={() => handleCopyFromPrevious(dog._id, date.date)}
                                >
                                    Duplicate from previous day
                                </button>
                            )}                      
                        </div>
                        ))}
                    </div>
                    ))}
                </div>
                <div className="calendar-edit-buttons">
                    <button className="form-button" onClick={handleUpdateCalendar}>Update Calendar With Changes</button>
                    <button className="form-button" onClick={handleSubmitCalendar}>Submit Completed Calendar</button>
                </div>
            </div>
            )
            }

    return (
        <>
            {loaded ? menuElement() : <div>loading...</div>}
        </>
    )
}


