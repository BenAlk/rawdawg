import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useGetUserID } from '../hooks/useGetUserID'
import axios from 'axios'
import { useCookies } from 'react-cookie'

export const EditFood = () => {
    const foodId = useParams()
    const [food, setFood] = useState({
        name: "",
        weight: 0,
        price: 0,
})
    const userID = useGetUserID()
    const navigate = useNavigate()
    const [cookies ,] = useCookies(["access_token"])

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const response = await axios.get(
                    `https://rawdawg.onrender.com/food/edit/${foodId.id}`, {  headers: {authorization: cookies.access_token }}
                )
                setFood(response.data.food)
            } catch(err) {
            console.log(err)
            }
        }
    fetchFood()
    console.log(foodId)
    }, [userID, foodId, cookies.access_token])  

    const handleChange = (event) => {
        const {name, value} = event.target
        setFood({...food, [name]: value})
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        try{
            await axios.put(`https://rawdawg.onrender.com/food/edit/${food._id}`, food, {  headers: {authorization: cookies.access_token }})
            alert(`${food.name} has been amended.`)
            navigate("/Config")
        }   catch(err){
            console.error(err)
        }
    }

    return (
        <div className="food">
            <div className="food-container">
                <h2>Edit: {food.name}</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" value={food.name} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="weight">Weight(g):</label>
                        <input type="number" id="weight" name="weight" value={food.weight} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price(£:p)</label>
                        <input type="number" step="0.01" id="price" name="price" value={food.price} onChange={handleChange}/>
                    </div>
                    <button className="form-button" type="submit">Confirm Changes</button>
                    <Link to="/Config"><button className="form-button">Cancel</button></Link>
                </form>
            </div>
        </div>
    )

}