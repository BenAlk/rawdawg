import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetUserID } from '../hooks/useGetUserID'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import {Modal} from "../components/Modal"
import { useCookies } from 'react-cookie'

export const Config = () => {
    const [dogs, setDogs] = useState([])
    const [food, setFood] = useState([])
    const userID = useGetUserID()
    const [openModal, setOpenModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [cookies ,] = useCookies(["access_token"])

    useEffect(() => {
        const fetchDogsAndFood = async () => {
            try {
                const [dogList, foodList] = await Promise.all([
                    axios.get(`https://rawdawg.onrender.com/config/pack/${userID}`, {  headers: {authorization: cookies.access_token }}),
                    axios.get(`https://rawdawg.onrender.com/Food/${userID}`, {  headers: {authorization: cookies.access_token }})
                ])
                setDogs(dogList.data.dogs)
                setFood(foodList.data.food)
                setRefresh(false)
            } catch(err) {
                console.log(err)
            }
        }
    fetchDogsAndFood()
    }, [userID, refresh, cookies.access_token])

    const handleSetModal = (itemType, item) => {
        setOpenModal(true)
        setSelectedItem({itemType, item, userID})
    }
    console.log(selectedItem)
    console.log(food)

    return (
        <div className="dog">
            {openModal ? <Modal type={selectedItem} open={openModal} onClose={() => { setOpenModal(false); setRefresh(true)}} setRefresh={setRefresh} /> : null}
            <h1>{dogs.length > 0 ? 'Your pack' : 'You have no dogs in your pack yet'}</h1>
            <div className="pack-container">
                {dogs.map((dog) => (
                    <div className="dog-container pack-dog" key={dog._id}>
                        <h3>Name: {dog.name}</h3>
                        <h3>Weight: {dog.weight} kg</h3>
                        <h3>Meals: {dog.meals} per day</h3>
                        <h3>Weight per meal: {dog.mealweight} g</h3>
                        <div className="form-button-container">
                            <Link
                                to={`Edit/${dog._id}`}
                            >
                                <div className="form-button">
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                </div>
                            </Link>
                            <Link 
                                to={`/Config`}
                            >
                                <div className="form-button" onClick={() => handleSetModal("dog", dog)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </div>
                            </Link>
                        </div>
                    </div>
            ))}
            </div>
            <h1>{food.length > 0 ? 'Your menu' : 'You have no dog food in your menu'}</h1>
            <div className="dog-food-container">
                {food.map((food) => (
                    <div className="dog-container dog-food" key={food._id}>
                        <h3>Name: {food.name}</h3>
                        <h3>Weight: {food.weight} g</h3>
                        <h3>Price: £{food.price}</h3>
                        <div className="form-button-container">
                            <Link
                                to={`Food/${food._id}`}
                            >
                                <div className="form-button">
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                </div>
                            </Link>
                            <Link 
                                to={`/Config`}
                            >
                                <div className="form-button" onClick={() => handleSetModal("food item", food)}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}