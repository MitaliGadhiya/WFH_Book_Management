import express,{ Router } from "express";
import { Auth } from "../middleware/Auth"; 
import { FindUser } from "../query/User";
import { Category } from "../query/Category";
import { CategoryController } from "../controller/CategoryController";
import { CategoryServices } from "../services/CategoryServices";

const Categoryrouter : Router = express.Router()
const findUser: FindUser = new FindUser() 
const category : Category = new Category()
const categoryServices: CategoryServices = new CategoryServices(findUser,category)
const categoryController: CategoryController = new CategoryController(categoryServices)
const auth: Auth = new Auth(findUser);


Categoryrouter.post('/bookData',auth.authentication,(req,res)=>categoryController.categoryData(req,res))
Categoryrouter.post('/findData',auth.authentication,(req,res)=>categoryController.findCategory(req,res))
Categoryrouter.post('/deletecategory',auth.authentication,(req,res)=>categoryController.deleteCategory(req,res))
Categoryrouter.post('/updatecategory',auth.authentication,(req,res)=>categoryController.updateCategory(req,res))

export default Categoryrouter;

