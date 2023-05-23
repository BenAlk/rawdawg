import express from 'express'
import mongoose from 'mongoose'
import { DogConfigModel } from "../models/DogConfig.js"
import { UserModel } from "../models/Users.js"
import { CalendarModel } from "../models/Calendar.js"
import { DogFoodModel } from "../models/DogFood.js"
import { verifyToken } from './users.js'
const router = express.Router()

router.post("/", async (req, res) => {
    const calendar = new CalendarModel(req.body)
    try {
        const savedCalendar = calendar.save()
        res.json(savedCalendar)
    } catch(err) {
        res.json(err)
    }
})

router.get("/:userId", verifyToken, async(req, res) => {
    try{
        const savedCalendars = await CalendarModel.find({
            userOwner: { $in: [req.params.userId] }
        })
        res.status(201).json({ savedCalendars })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

router.get("/savedcalendars/:calendarId", verifyToken, async (req, res) => {
    try {
        const calendar = await CalendarModel.findById(req.params.calendarId)

        if(!calendar) {
            return res.status(404).json({ message: "Calendar not found"})
        }
        res.status(200).json({ calendar })
    } catch (err) {
        console.log(err)
    }
})

router.put('/savecalendar/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCalendar = req.body;
        const result = await CalendarModel.findByIdAndUpdate(id, updatedCalendar, { new: true });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/:calendarId', verifyToken, async (req, res) => {
    try {
        const { calendarId } = req.params
        const deletedCalendar = await CalendarModel.findByIdAndDelete(calendarId)

    if (!deletedCalendar) {
        return res.status(404).json({ message: 'Calendar not found'})
    }

    res.status(200).json({message: "Calendar deleted successfully"})
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal server error')
    }
})

router.get('/active-calendar/:userID', verifyToken, async (req, res) => {
    try {
        const { userID } = req.params;
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const completedCalendar = await CalendarModel.findOne({
            completed: true,
            dateStart: { $lte: today },
            dateEnd: { $gte: today },
            userOwner: userID,
        });

        res.status(200).json({ completedCalendar });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
})

export {router as calendarRouter}