
import { User } from '../models/User_model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const SECRET_KEY = process.env.SECRET_KEY
const Create_User = async (req, res) => {

  try {

    const { username, email, password, name } =  req.body;
    console.log("After getting value from req body");
    console.log(username);
    console.log(email);
    console.log(password);
    console.log(name);

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




    // Then saves
    const newUser = new User({
        username,
        password: hashed_password,
        name,
        email
    });
    
    console.log(username, email, password, name);

    await newUser.save();
    return res.status(200).json({message: "User created sucessfully"});

  } catch (error) {
    console.log("This is error", error)
    res.status(500).json({message: "This is error"})
  }
};

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
    
}










export {Create_User, Login_User}