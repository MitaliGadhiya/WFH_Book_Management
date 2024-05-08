import { Books } from "../interface/BooksInterface";
import { Schema,model } from "mongoose";
import AuthorModel from "./Author";
import CategoryModel from "./Category";

const Bookschema = new Schema<Books>({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true  
    },
    categoty:{
        type: String,
        required: true       
    },
    ISBN:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
})

const BooksModel = model<Books>('Book',Bookschema);

export default BooksModel