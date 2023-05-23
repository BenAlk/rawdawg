import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: {
        type: 'string', 
        required: true, 
        unique: true
    },
    password: {
        type: 'string', 
        required: true
    },
    dogs: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "dogconfigs"
        }
    ]
})

export const UserModel = mongoose.model("users", UserSchema)