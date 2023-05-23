import mongoose from 'mongoose'

const DogConfigSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    weight: {
        type: Number, 
        required: true,
    },
    meals: {
        type: Number,
        required: true,
    },
    mealweight: {
        type: Number,
        required : true,
    },
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }
})

export const DogConfigModel = mongoose.model("dogconfigs", DogConfigSchema)