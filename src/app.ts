import express,{Request,Response} from 'express'
import {PORT} from './constants/handle'
import { Connection } from './db/connection';
import router from './routes/UserRoutes';
import cookieParser from "cookie-parser";
import Bookrouter from './routes/BookRoutes';
import Authorrouter from './routes/AuthorRoutes';
import Categoryrouter from './routes/CategoryRoutes';


const app = express();


const db = new Connection()
db.connections()

app.use(cookieParser());

app.use(express.json());


app.use('/user',router);
app.use('/book',Bookrouter);
app.use('/author',Authorrouter);
app.use('/category',Categoryrouter);

app.listen(PORT,():void =>{
    console.log('server is running at port 3000');
})
