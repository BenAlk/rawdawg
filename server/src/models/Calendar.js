import mongoose from 'mongoose'

const CalendarSchema = new mongoose.Schema({
    dateStart: {
        type: Date,
        required: true
    },
    dateEnd: {
        type: Date,
        required: true
    },
    dogs: [{
            name: {type: String, required: true},
            mealweight: {type: Number, required: true},
            meals: {type: Number, required: true},
            dogId: {type: mongoose.Schema.Types.ObjectId, ref: "dogconfigs", required: true},
            dates: [{
                date: {type: Date, required: true},
                menuItems: {
                    foodId1: {type: mongoose.Schema.Types.ObjectId, ref: "dogfood", required: true},
                    weight1: {type: Number, required: true},
                    foodId2: {type: mongoose.Schema.Types.ObjectId, ref: "dogfood", required: true},
                    weight2: {type: Number, required: true}
                }
            }]
    
    }],
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    }
})

export const CalendarModel = mongoose.model("calendar", CalendarSchema)