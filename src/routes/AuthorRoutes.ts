import express,{ Router } from "express";
import { Auth } from "../middleware/Auth"; 
import { FindUser } from "../query/User";
import { Author } from "../query/Author";
import { AuthorController } from "../controller/AuthorController";
import { AuthorServices } from "../services/AuthorServices";

const Authorrouter : Router = express.Router()
const findUser: FindUser = new FindUser() 
const author : Author = new Author()
const authorServices: AuthorServices = new AuthorServices(findUser,author)
const authorController: AuthorController = new AuthorController(authorServices)
const auth: Auth = new Auth(findUser);


Authorrouter.post('/bookData',auth.authentication,(req,res)=>authorController.AuthorData(req,res))
Authorrouter.post('/findData',auth.authentication,(req,res)=>authorController.findAuthor(req,res))
Authorrouter.post('/deleteBook',auth.authentication,(req,res)=>authorController.deleteAuthor(req,res))
Authorrouter.post('/updateBook',auth.authentication,(req,res)=>authorController.updateAuthor(req,res))

export default Authorrouter;

