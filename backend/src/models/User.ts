import mongoose, { Schema } from "mongoose";

export interface IUser {
    handle:string;
    name: string;
    email: string;
    password: string;
}
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
        lowercase: true,

    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    handle: {
        type: String,
        required: true,
        trim:true,
        lowercase: true,
        unique: true,
    },

})

const User=mongoose.model<IUser>("User",userSchema)
export default User;