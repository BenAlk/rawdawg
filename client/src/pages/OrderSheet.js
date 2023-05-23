import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserID } from '../hooks/useGetUserID';
import axios from 'axios';
import { useCookies } from 'react-cookie'

export const OrderSheet = () => {
    const calendarId = useParams();
    const [calendar, setCalendar] = useState([]);
    const [foods, setFoods] = useState([]);
    const userID = useGetUserID();
    const [loaded, setLoaded] = useState(false);
    const [cookies ,] = useCookies(["access_token"])

    useEffect(() => {
        const fetchCalendar = async () => {
        try {
            const [savedCalendar, foodList] = await Promise.all([
            axios.get(`https://rawdawg.onrender.com/calendar/savedcalendars/${calendarId.id}`, {  headers: {authorization: cookies.access_token }}),
            axios.get(`https://rawdawg.onrender.com/Food/${userID}`, {  headers: {authorization: cookies.access_token }})
            ]);
            setCalendar(savedCalendar.data.calendar);
            setFoods(foodList.data.food);
            setLoaded(true);
        } catch (err) {
            console.log(err);
        }
        };
        fetchCalendar();
    }, [calendarId, userID, cookies.access_token]);

    const totalCalculations = () => {
        const foodTotalsArray = [];
        calendar.dogs.forEach((dog) => {
        dog.dates.forEach((date) => {
            const { foodId1, weight1, foodId2, weight2 } = date.menuItems;

            // Update the total weight for foodId1
            const existingFood1 = foodTotalsArray.find((item) => item.foodId === foodId1);
            if (existingFood1) {
            existingFood1.weight += weight1 * dog.meals;
            } else {
            foodTotalsArray.push({ foodId: foodId1, weight: weight1 * dog.meals });
            }

            // Update the total weight for foodId2
            const existingFood2 = foodTotalsArray.find((item) => item.foodId === foodId2);
            if (existingFood2) {
            existingFood2.weight += weight2 * dog.meals;
            } else {
            foodTotalsArray.push({ foodId: foodId2, weight: weight2 * dog.meals });
            }
        });
        });

        foodTotalsArray.forEach((foodTotal) => {
        // Find the corresponding food object in the foods state based on the foodId
        const matchingFood = foods.find((food) => food._id === foodTotal.foodId);

        if (matchingFood) {
            // Calculate the number of chubbs needed (rounding up if there is a remainder)
            const numChubbs = Math.ceil(foodTotal.weight / matchingFood.weight);

            // Calculate the total price (number of chubbs multiplied by the price)
            const totalPrice = numChubbs * matchingFood.price;

            // Add the additional variables to the foodTotal object
            foodTotal.name = matchingFood.name;
            foodTotal.numChubbs = numChubbs;
            foodTotal.price = matchingFood.price;
            foodTotal.totalPrice = totalPrice;
        }
        });

        const overallTotalPrice = foodTotalsArray.reduce((sum, foodTotal) => sum + foodTotal.totalPrice, 0);

        return (
        <div className="table-container">
            <table className="order-sheet-table">
            <thead>
                <tr>
                <th>Name</th>
                <th>Total Chubbs</th>
                <th>Total Weight</th>
                <th>Chubb Price</th>
                <th>Total Price</th>
                </tr>
            </thead>
            <tbody>
                {foodTotalsArray.map((foodTotal, index) => (
                <tr key={foodTotal.foodId} className={index % 2 === 0 ? "even-row" : "odd-row" }>
                    <td className="table-align-left">{foodTotal.name}</td>
                    <td className="table-align-center">{foodTotal.numChubbs}</td>
                    <td className="table-align-right">{foodTotal.weight}(g)</td>
                    <td className="table-align-right">£{foodTotal.price}</td>
                    <td className="table-align-right">£{foodTotal.totalPrice.toFixed(2)}</td>
                </tr>
                ))}
                <tr>   
                <td colSpan="5" className="total-price-row table-align-right even-row">
                    Total Price: {overallTotalPrice.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        );
    };

    return <>{loaded ? totalCalculations() : <div>Loading...</div>}</>;
};
