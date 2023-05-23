import express from 'express'
import cors from 'cors'
import { userRouter } from './routes/users.js'
import { dogConfigRouter } from './routes/dogconfig.js'
import { dogFoodRouter } from './routes/dogfood.js'
import { calendarRouter } from './routes/calendar.js'
import { mongoose } from 'mongoose'
import dotenv from 'dotenv'


dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.use("/auth", userRouter)
app.use("/config", dogConfigRouter)
app.use("/food", dogFoodRouter)
app.use("/calendar", calendarRouter)

mongoose.connect(process.env.MONGODB_URL) //Change password to environment variable

app.listen(3001, () => console.log('Server Started!'))