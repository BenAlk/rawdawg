import { useState } from 'react'
import { useGetUserID } from '../hooks/useGetUserID'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {useCookies} from 'react-cookie'

export const AddFood = () => {
    const userID = useGetUserID()
    const [newFood, setNewFood] = useState({
        name: "",
        weight: null,
        price: null,
        user: userID,
    })
    const navigate = useNavigate()
    const [cookies ,] = useCookies(["access_token"])

    const handleChange = (event) => {
        const {name, value} = event.target
        setNewFood({...newFood, [name]: value})
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        try{
            const food = await axios.post("http://localhost:3001/food", newFood, {  headers: {authorization: cookies.access_token }})
            if(food.data.message){
                alert(food.data.message)
            } else {
                alert(`${newFood.name} has been added to your menu!`)
                navigate("/Config")
            }
        }   catch(err){
            console.error(err)
        }
    }

    return (
        <div className="food">
            <div className="food-container">
                <h2>Add new food</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name"  onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="weight">Weight(g):</label>
                        <input type="number" id="weight" name="weight"  onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price(£:p)</label>
                        <input type="number" step="0.01" id="price" name="price"  onChange={handleChange}/>
                    </div>
                    <button className="form-button" type="submit">Add Food</button>
                </form>
                <p>If the food already exists it will be added to your selected menu.</p>
            </div>
        </div>
    )


}