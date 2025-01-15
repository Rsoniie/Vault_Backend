import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            validate: {
                validator: function(password)
                {
                    return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password);
                },
                message: props => `${props.value} is not a valid password! Password must contain at least one digit, one lowercase and one uppercase letter.`
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate : {
                validator: function(email) {
                    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return regex.test(email);
                },
                message: props => `${props.value} is not a valid email address!`
            }
        }, 

        stars: {
            type: Number,
            default: 0
        },

        uploaded_pdfs: {
            type: [String]
        },

        liked_pdfs: {
            type: [mongoose.Types.ObjectId],
            Ref: 'File',
            
        },

        name: {
            type : String,
            // required : true
        },

        verified: {
            type: Boolean,
            default: false
        },
        profession: {
            type: String
        },
        institution: {
            type: String
        }

    }
);

export const User = mongoose.model('User', userSchema)
