import express,{ Router } from "express";
import { Auth } from "../middleware/Auth"; 
import { FindUser } from "../query/User";
import { Book } from "../query/Book";
import { BookController } from "../controller/BookController";
import { BooksServices } from "../services/BooksServices";

const Bookrouter : Router = express.Router()
const findUser: FindUser = new FindUser() 
const book : Book = new Book()
const booksServices: BooksServices = new BooksServices(findUser,book)
const booksController: BookController = new BookController(booksServices)
const auth: Auth = new Auth(findUser);


Bookrouter.post('/bookData',auth.authentication,(req,res)=>booksController.BookData(req,res))
Bookrouter.post('/findData',auth.authentication,(req,res)=>booksController.findBook(req,res))
Bookrouter.post('/deleteBook',auth.authentication,(req,res)=>booksController.deleteBook(req,res))
Bookrouter.post('/updateBook',auth.authentication,(req,res)=>booksController.updateBook(req,res))

export default Bookrouter;

