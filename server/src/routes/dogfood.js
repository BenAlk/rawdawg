import express from 'express'
import mongoose from 'mongoose'
import { DogFoodModel } from '../models/DogFood.js'
import { UserModel } from "../models/Users.js"
import { verifyToken} from "./users.js"

const router = express.Router()

router.get("/:userId", verifyToken, async (req, res) => {
    try{
        const food = await DogFoodModel.find({
            users: { $in: [req.params.userId] }
        })
        console.log(food)
        res.status(201).json({ food })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

router.post("/", verifyToken, async (req, res) => {
    const { name, weight, user, price } = req.body
    const existingFood = await DogFoodModel.findOne({
        name: name,
        price: price,
        weight: weight
    })

    if(existingFood) {
        if(existingFood.users.includes(user)){
            res.json({ message: "You already have this food on your menu!"})
            return
        } else {
            existingFood.users.push(users)
            try {
                const savedFood = await existingFood.save()
                res.json(savedFood)
                return
            } catch(err) {
                res.json(err)
                return
            }
        }
    } else {
        const food = new DogFoodModel({
            name: name,
            weight: weight,
            price: price,
            users: [user],
        }
        )
        try{
            const savedFood = await food.save()
            res.json(savedFood)
        } catch(err) {
            res.json(err)
        }

    }
})

router.put("/edit/:foodId", verifyToken, async (req, res) => {
    try {
        const food = await DogFoodModel.findById(req.params.foodId)

        if (!food) {
        return res.status(404).json({ message: "You do not have permission to edit this." });
        }
    
        food.name = req.body.name || food.name
        food.weight = req.body.weight || food.weight
        food.price = req.body.price || food.price
    
        await food.save();
    
        res.status(200).json({ message: "Food item updated successfully", food });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
    });

    router.get("/edit/:foodId", verifyToken, async (req, res) => {
        try {;
            const food = await DogFoodModel.findById(req.params.foodId)
            
            if (!food) {
            return res.status(404).json({ message: "Food not found" });
            }
            res.status(200).json({ food });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Something went wrong" });
        }
        });

    router.delete('/:foodId/user/:userId/', verifyToken, async (req, res) => {
        try {
            const foodId = req.params.foodId
            const userId = req.params.userId
        
            const dogFood = await DogFoodModel.findById(foodId);
            console.log(dogFood)
            if (!dogFood) {
                return res.status(404).json({ message: 'Dog food not found.' });
            }
        
            if (!dogFood.users.includes(userId)) {
                return res.status(404).json({ message: 'User does not have this food assigned to them.' });
            }

            dogFood.users.pull(userId);
        
            if (dogFood.users.length === 0) {
                await DogFoodModel.deleteOne({_id: foodId})
                return res.status(200).json({ message: 'Dog food deleted' });
            }
        
            await dogFood.save();
        
            res.status(200).json({ message: 'User removed from dog food' });
            } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong' });
            }
        });

export { router as dogFoodRouter }