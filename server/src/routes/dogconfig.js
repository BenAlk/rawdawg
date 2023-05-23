import express from 'express'
import mongoose from 'mongoose'
import { DogConfigModel } from "../models/DogConfig.js"
import { UserModel } from "../models/Users.js"
import { verifyToken } from './users.js'
const router = express.Router()

router.get("/pack/:userId", verifyToken, async (req, res) => {
    try{
        const user = await UserModel.findById(req.params.userId)
        const dogs = await DogConfigModel.find({
            _id: { $in: user.dogs }
        })
        console.log(dogs)
        res.status(201).json({ dogs })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

router.post("/", async (req, res) => {
    const dog = new DogConfigModel(req.body)
    try {
        const savedDog = await dog.save()
        const userId = req.body.userOwner
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $push: {dogs: savedDog._id } },
            {new: true }
            )
        res.json(savedDog)
    } catch (err) {
        res.json(err)
    }
})

router.get("/pack/dog/:dogId", verifyToken, async (req, res) => {
    try {
        const dog = await DogConfigModel.findById(req.params.dogId)
    
        if (!dog) {
        return res.status(404).json({ message: "Dog not found" });
        }
        res.status(200).json({ dog });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
    });

router.put("/pack/:userId/dog/:dogId", verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        const dog = await DogConfigModel.findById(req.params.dogId)
    
        if (!user || !dog) {
        return res.status(404).json({ message: "User or dog not found" });
        }
    
        dog.name = req.body.name || dog.name
        dog.weight = req.body.weight || dog.weight
        dog.meals = req.body.meals || dog.meals
        dog.mealweight = req.body.mealweight || dog.mealweight
    
        await dog.save();
    
        res.status(200).json({ message: "Dog updated successfully", dog });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
    });

    router.delete("/pack/:userId/dog/:dogId", verifyToken, async (req, res) => {
        try {
            const user = await UserModel.findById(req.params.userId);
            const dog = await DogConfigModel.findById(req.params.dogId);
    
            if (!user || !dog) {
                return res.status(404).json({ message: "User or dog not found" });
            }
    
            await DogConfigModel.deleteOne({ _id: dog._id });
            await UserModel.findByIdAndUpdate(
                user._id,
                { $pull: { dogs: dog._id } },
                { new: true }
            );
    
            res.status(200).json({ message: "Dog has been successfully removed from your pack." });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Something went wrong" });
        }
    });
    

export { router as dogConfigRouter}


