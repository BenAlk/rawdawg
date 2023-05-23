import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useGetUserID } from '../hooks/useGetUserID'
import axios from 'axios'
import { useCookies } from 'react-cookie'

export const EditDog = () => {
    const dogId = useParams()
    const [dog, setDog] = useState({
        name: "",
        weight: 0,
        meals: 0,
        mealweight: 0,
    })
    const userID = useGetUserID()
    const [cookies ,] = useCookies(["access_token"])
    const navigate = useNavigate()
    useEffect(() => {
        const fetchDog = async () => {
            try {
                const response = await axios.get(
                    `https://rawdawg.onrender.com/config/pack/dog/${dogId.id}`, {  headers: {authorization: cookies.access_token }}
                )
                setDog(response.data.dog)
            } catch(err) {
            console.log(err)
            }
        }
    fetchDog()
    console.log(dogId)
    }, [userID, dogId, cookies.access_token])  

    const handleChange = (event) => {
        const {name, value} = event.target
        setDog({...dog, [name]: value})
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        try{
            await axios.put(`https://rawdawg.onrender.com/config/pack/${userID}/dog/${dog._id}`, dog, {  headers: {authorization: cookies.access_token }})
            alert(`${dog.name} has been amended.`)
            navigate("/Config")
        }   catch(err){
            console.error(err)
        }
    }

    return (
        <div className="dog">
            <div className="dog-container">
                <h2>Edit {dog.name}</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" value={dog.name} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="weight">Weight(kg):</label>
                        <input type="number" step="0.1" id="weight" name="weight" value={dog.weight} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="meals">Meals per day:</label>
                        <input type="number" id="meals" name="meals" value={dog.meals} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mealweight">Weight per meal:</label>
                        <input type="number" id="mealweight" name="mealweight" value={dog.mealweight} onChange={handleChange} />
                    </div>
                    <button className="form-button" type="submit">Confirm Changes</button>
                    <Link to=".."><button className="form-button">Cancel</button></Link>
                </form>
            </div>
        </div>
    )
}

