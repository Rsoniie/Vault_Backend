
import { User } from '../models/User_model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateOTP, verifyOTP } from '../services/Otp_Verification.js'
import { File } from '../models/Pdf_model.js'





const SECRET_KEY = process.env.SECRET_KEY



let EMAIL = "";
const Create_User = async (req, res) => {

  try {

    const { username, email, password, profession, institution } =  req.body;

    if(!username || !email || !password)
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


     


        const newUser = new User({
            username,
            password: hashed_password,
            email,
            profession,
            institution
        });
        
        EMAIL = email;
        console.log(username, email, password, institution, profession);
    
        await newUser.save();
        return res.status(200).json({message: "OTP sent successfully.", otp: generated_result.otp});
        

  } catch (error) {
    console.log("This is error", error)
    res.status(500).json({message: "This is error"})
  }
};

const Verify_Otp = async(req, res) => {
    try {

        const user_otp = req.body;
        const isVerified = await verifyOTP(EMAIL, user_otp);

        if(!isVerified)
        {
            return res.status(400).json({message: "Enter correct OTP."});
        }

        const email = EMAIL;
        const curr_user = await User.findOne({email});
        curr_user.verified = true;
        await curr_user.save();
 
        console.log(curr_user);

        return res.status(200).json({message: "OTP Verified successfully.", email: EMAIL});

    } catch (error) {
        console.log("Internal Error", error);
        return res.status(500).json({message: "Internal server error", error : error});
    }
}

const Login_User = async(req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if(!user)
        {
            return res.status(400).json({message: "User not found"});
        }

        if(user.verified == false)
        {
            return res.status(405).json({message: "OTP not verified"});
        }

        const isPasswordcorrect = await bcrypt.compare(password, user.password);

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

const Profile = async (req, res) => 
{

    console.log("Get into client side profile view");
    try{

      const username = await req.params.name;
    //   const username = await req.params.author_name;
      if(!username)
      {
        return res.status(400).json({message: "User Not selected"});
      }
    //   console.log(username);
      const user = await User.findOne({username});
      console.log(username);
      const all_files = await File.find({author_name: username}).sort({_id : -1});
      return res.status(200).json({message: "User found Sucessfully", user: user, all_files});
    }
    catch(error)
    {
        console.log("Internal Server error", error);
        return res.status(500).json({message: "Internal server error"});
    }


};


export {Create_User, Login_User, Verify_Otp, Profile}