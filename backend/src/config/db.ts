import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); 
export const connectDB=async () => {
    try {
        const url=process.env.MONGO_URI
        const {connection}=await mongoose.connect(url)
        const host=`${connection.host}:${connection.port}`

        console.log(`Base de datos conectada en: ${host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}