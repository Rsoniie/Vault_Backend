import mongoose, { Schema } from "mongoose";

const pdfSchema = new mongoose.Schema({

    file_path: {
        type: String,
        required: true
    },
    topic: {
        type: String, 
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    key_words: {
        type: [String]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    likes: {
        type: Number,
        default: 0
    }

    
});

export const File = mongoose.model('File', pdfSchema)
