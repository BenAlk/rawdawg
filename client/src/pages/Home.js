import React, {useEffect, useState} from 'react'
import {useGetUserID} from '../hooks/useGetUserID'
import axios from 'axios'
import {Link} from 'react-router-dom'
import { useCookies } from 'react-cookie'

export const Home = () => {

    const [user, setUser] = useState(null)
    const [calendar, setCalendar] = useState([])
    const [foods, setFoods] = useState([])
    const userID = useGetUserID()
    const [loaded, setLoaded] = useState(false)
    const [defrost, setDefrost] = useState(false)
    const [cookies ,] = useCookies(["access_token"])

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const [savedCalendar, foodList, checkUser] = await Promise.all([
                axios.get(`https://rawdawg.onrender.com/calendar/active-calendar/${userID}`, {  headers: {authorization: cookies.access_token }}),
                axios.get(`https://rawdawg.onrender.com/Food/${userID}`, {  headers: {authorization: cookies.access_token }}),
                axios.get(`https://rawdawg.onrender.com/auth/userCheck/${window.localStorage.getItem('userID')}`, {  headers: {authorization: cookies.access_token }})
            ])
                if(savedCalendar.data.completedCalendar) {
                setCalendar(savedCalendar.data.completedCalendar)
                setFoods(foodList.data.food)
                
            }
                setLoaded(true)
                setUser(checkUser)
            } catch (err) {
                console.log(err)
            }
        }
        fetchCalendar()
        console.log(user)
        console.log(loaded)
    }, [loaded, user, userID, cookies.access_token])

    useEffect(() => {
        console.log(calendar.length)
        if (calendar.length === 0) return; // Wait for calendar data to be loaded
        
        const today = new Date().toLocaleDateString();
        const tomorrowDateString = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString();
    
        const hasDifferentMenuItems = calendar.dogs.some((dog) => {
        const todayMenuItems = dog.dates.find((date) => new Date(date.date).toLocaleDateString() === today)?.menuItems;
        const tomorrowMenuItems = dog.dates.find((date) => new Date(date.date).toLocaleDateString() === tomorrowDateString)?.menuItems;
    
        return (
            todayMenuItems?.foodId1 !== tomorrowMenuItems?.foodId1 ||
            todayMenuItems?.weight1 !== tomorrowMenuItems?.weight1 ||
            todayMenuItems?.foodId2 !== tomorrowMenuItems?.foodId2 ||
            todayMenuItems?.weight2 !== tomorrowMenuItems?.weight2
        );
        });
    
    setDefrost(hasDifferentMenuItems);
    }, [calendar])

    const displayMenu = () => {
        if(!calendar.dogs) {
            return <div>you have no data</div>
        } else {
        const today = new Date().toLocaleDateString()
        console.log(today)
        const tomorrowDateString = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString();
        console.log(tomorrowDateString)

        const filteredDogs = calendar.dogs.map((dog) => {
            const filteredDates = dog.dates.filter((date) => {
                const dateString = new Date(date.date).toLocaleDateString()
                return dateString === today || dateString === tomorrowDateString;
            });

            return { ...dog, dates: filteredDates };
        });
        console.log("filteredDogs")
        console.log(filteredDogs)

        return (
            <div className="container">
                <div className="calendar-pack-container">
                    {filteredDogs.map((dog) => (
                    <div className="calendar-dog-container" key={dog._id}>
                        <h2>{dog.name}'s Menu</h2>
                        {dog.dates.map((date,index) => (
                        <>
                            {defrost && index === 1 && <div className="calendar-edit-container red expired"> DEFROST IS NEEDED!</div>}
                            <div className="calendar-edit-container" key={date._id}>
                                <h3>{new Date(date.date).toLocaleDateString() === today ? "Todays Meal" : "Tomorrows Meal"}</h3>
                                <div className="date-menu-container">
                                    <select
                                        name={`foodId1-${dog._id}-${date._id}`}
                                        value={date.menuItems.foodId1}
                                        readOnly
                                        disabled
                                        style={{ color: 'black', background: 'white', cursor: 'not-allowed' }}
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
                                        readOnly
                                    />
                                    <p>(g)</p>
                                </div>
                                <div className="date-menu-container">
                                    <select
                                        name={`foodId2-${dog._id}-${date._id}`}
                                        value={date.menuItems.foodId2}
                                        readOnly
                                        disabled
                                        style={{ color: 'black', background: 'white', cursor: 'not-allowed' }}
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
                                        readOnly
                                    />
                                    <p>(g)</p>
                                </div>                     
                            </div>
                        </>
                        ))}
                    </div>
                    ))}
                </div>
                <Link
                    to={`Calendar/Edit/${calendar._id}`}
                    
                >
                    <div className="form-button" title="View Calendar" >
                        View Full Calendar
                    </div>
                </Link>
            </div>
            )
        }
    }

    return (
        <>
    {user && loaded ? displayMenu() : !user && loaded ? <div>Click Login to begin</div> : <div>loading...</div>}
        </>
    )
}