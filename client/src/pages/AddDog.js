import { useState } from 'react'
import { useGetUserID } from '../hooks/useGetUserID'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {useCookies} from 'react-cookie'

export const AddDog = () => {
    const [cookies ,] = useCookies(["access_token"])
    const userID = useGetUserID()
    const [newDog, setNewDog] = useState({
        name: "",
        weight: null,
        meals: null,
        mealweight: null,
        userOwner: userID,
    })
    const navigate = useNavigate()

    const handleChange = (event) => {
        const {name, value} = event.target
        setNewDog({...newDog, [name]: value})
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        try{
            await axios.post("https://rawdawg.onrender.com/config", newDog, {  headers: {authorization: cookies.access_token }})
            alert(`${newDog.name} has been added to your pack.`)
            navigate("/Config")
        }   catch(err){
            console.error(err)
        }
    }

    return (
        <div className="dog">
            <div className="dog-container">
                <h2>Add new dog</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name"  onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="weight">Weight(kg):</label>
                        <input type="number" step="0.1" id="weight" name="weight"  onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="meals">Meals per day:</label>
                        <input type="number" id="meals" name="meals" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mealweight">Weight per meal(g):</label>
                        <input type="number" id="mealweight" name="mealweight" onChange={handleChange} />
                    </div>
                    <button className="form-button" type="submit">Add dog</button>
                </form>
            </div>
        </div>
    )
}
