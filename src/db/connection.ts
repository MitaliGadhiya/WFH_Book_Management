import {connect} from "mongoose"
import { URL } from "../constants/handle"
import { SUCCESS } from "../constants/handle"

export class Connection{
    public async connections():Promise<void>{
        return connect(URL)
        .then(()=>{
            console.log(SUCCESS)
    })
    .catch((error: Error)=>{
            // throw error;
            console.log(error);
    })
    }
}

