import express,{ Router } from "express";
import { UserController } from "../controller/UserController";
import {FindUser} from "../query/User"
import { UserServices } from "../services/UserServices";
import { Auth } from "../middleware/Auth"; 


const router : Router = express.Router()
const findUser: FindUser = new FindUser() 

const userServices : UserServices = new UserServices(findUser)
const User: UserController = new UserController(userServices)
const auth: Auth = new Auth(findUser);


router.post('/',(req,res)=>User.Userdata(req,res))
router.post('/find',(req,res)=>User.login(req,res))
router.post('/delete',auth.authentication,(req,res)=>User.deleteUSer(req,res))
router.post('/findall',auth.authentication,(req,res)=>User.findAll(req,res))


export default router;