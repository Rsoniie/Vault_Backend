
import mongoose from "mongoose";
import { DB_Name } from "../constants.js";


const ConnectDB = async () => {

    try {
        console.log("Thisi is mongodb uri from env", process.env.MONGODB_URI);
        const connectioninstance = await mongoose.connect(`${process.env.MONGODB_URI}${DB_Name}`);
        console.log(`Mongo DB connection sucessfull || DB host ${connectioninstance.connection.host}`);
    } catch (error) {
        console.log("Error in Connecting Database", error);
    }
}

export default ConnectDB;