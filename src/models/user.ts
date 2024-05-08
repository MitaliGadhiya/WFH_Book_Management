import { User } from "../interface/User";
import { Schema, model } from "mongoose";

const Userschema = new Schema<User>({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password :{
        type:String,
        required: true
    },
    role:{
        type: String,
        required: true
    }
})

const UserModel = model<User>('user',Userschema)

export default UserModel