import mongoose, { Schema } from "mongoose";

const FeedSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
        
    }
});

export const Feed =  mongoose.model('Feed', FeedSchema);