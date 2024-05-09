import "reflect-metadata";
import express,{Request,Response} from 'express'
import {PORT} from './constants/handle'
import { Connection } from './db/connection';
import cookieParser from "cookie-parser";
import { InversifyExpressServer } from 'inversify-express-utils';
import container from './inversify.config';


const db = new Connection()
db.connections()

const server = new InversifyExpressServer(container);
server.setConfig((app) => {
    app.use(express.json());
    app.use(cookieParser());
});

const app = server.build();

app.listen(PORT,():void =>{
    console.log('server is running at port 3000');
})
