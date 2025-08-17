import mongoose from "mongoose";
import { config } from "../config/config.js";

export default async function DBConnection(){
    try {
        console.log("config : ",config)
       await mongoose.connect(config.DB_URL)
       console.log("db is connected successfully")
    } catch (error) {
        console.log("DBConnection error : ",error)
    }
}