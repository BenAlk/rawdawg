import mongoose from 'mongoose'

const DogFoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    weight:{
        type: Number,
        required: true,
    },
    price: {
        type: String,
        min: 0.01,
        max: 999999.99,
        set: v => parseFloat(v).toFixed(2),
        get: v => parseFloat(v).toFixed(2),
        required: true,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        }
    ]
})

export const DogFoodModel = mongoose.model("dogfood", DogFoodSchema)