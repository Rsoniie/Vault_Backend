
import { User } from '../models/User_model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateOTP, verifyOTP } from '../services/Otp_Verification.js'



const SECRET_KEY = process.env.SECRET_KEY



const Create_User = async (req, res) => {

  try {

    const { username, email, password, name } =  req.body;

    if(!username || !email || !password || !name)
    {
        return res.status(400).json({message : "All fields are required"});
    }

    const existing_username = await User.findOne({username});

    if(existing_username)
    {
        return res.status(400).json({message: "Username already exists."});
    }

    const existing_email = await User.findOne({email});

    if(existing_email)
    {
        return res.status(400).json({message: "Email already exists."})
    }

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);
    console.log(hashed_password);


    // OTP feature
    const generated_result =  await generateOTP(email);
    console.log("your otp is", generated_result.otp);

    return res.status(200).json({message: "OTP sent successfully.", otp: generated_result.otp});
     

    const user_otp = await req.body;
    const isVerified = await verifyOTP(email, user_otp);

    if(isVerified.success == false)
    {
        return res.status(400).json({message: "Please enter correct OTP"});
    }
    else 
    {
        const newUser = new User({
            username,
            password: hashed_password,
            name,
            email
        });
        
        console.log(username, email, password, name);
    
        await newUser.save();
        return res.status(200).json({message: "User created sucessfully"});

    }

  } catch (error) {
    console.log("This is error", error)
    res.status(500).json({message: "This is error"})
  }
};

// const Verify_Otp = async(req, res) => {
//     try {
//         const user_otp = req.body;
//         const email = req.body;

//         // const isVerified = await verifyOTP(email, user_otp);

//         if(!isVerified)
//         {
//             return res.status(400).json({message: "Enter correct OTP"});
//         }
//         const {username, password, name} = req.body;
//         const salt = await bcrypt.genSalt(10);
//         const hashed_password = await bcrypt.hash(password, salt);
//         console.log(username, hashed_password, name, email, user_otp);
//         return res.status(200).json({message: "Successfully get into verification part"});

//     } catch (error) {
//         console.log("Internal Error", error);
//         return res.status(500).json({message: "Internal server error", error : error});
//     }
// }

const Login_User = async(req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if(!user)
        {
            return res.status(400).json({message: "User not found"});
        }

        const isPasswordcorrect = bcrypt.compare(password, user.password);

        if(!isPasswordcorrect)
        {
            return res.status(400).json({message: "Please fill correct credentials"});
        }

        const token = jwt.sign({ userId: user._id}, SECRET_KEY, {expiresIn: '6h'});
        console.log("This is token", token);
        return res.status(200).json({message: "User logged In successfully", token, user});

    } catch (error) {
        console.log("This is error while login user", error);
        return res.status(500).json({message: "Error while login user"});
    }
};

const Edit_Profile = async(req, res) => {

};










export {Create_User, Login_User}