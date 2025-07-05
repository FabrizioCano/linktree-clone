import mongoose, { Schema,Document } from "mongoose";

export interface IUser extends Document{
    handle:string;
    name: string;
    email: string;
    password: string;
    description: string;
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
    description: {
        type: String,
        default: '',
        trim:true
    },

})

const User=mongoose.model<IUser>("User",userSchema)
export default User;