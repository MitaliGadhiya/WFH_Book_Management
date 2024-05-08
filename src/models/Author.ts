import { Author1 } from "../interface/AuthorsInterface";
import { Schema,model } from "mongoose";

const Authorschema = new Schema<Author1>({
    name:{
        type:String,
        required: true
    },
    biography:{
        type:String,
        required: true
    },
    nationality:{
        type:String,
        required: true
    }
})

const AuthorModel = model<Author1>('author',Authorschema)

export default AuthorModel;