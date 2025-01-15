
import { Feed } from "../models/Feedback_model.js";

const Feedback = async(req, res) => {
  try{
     const {name, email, feedback, rating} = req.body;

     const newfeed = new Feed({
        name,
        email,
        feedback,
        rating
     })
    await newfeed.save();


     console.log(name, email, feedback, rating);
     return res.status(200).json({message: "feedback saved successfully"});
  }catch(error)
  {
    console.log("This is error in catch block", error);
    return res.status(500).json({message: "Internal server error"});
  }
}

export {Feedback};

