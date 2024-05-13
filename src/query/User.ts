import UserModel from "../models/user";
import { inject, injectable } from "inversify";

@injectable()
export class FindUser{
    async find(email : string, password: string) : Promise<any>{
        return await UserModel.findOne({email, password });
    }
    async delete(_id: string): Promise<any>{
        return await UserModel.deleteOne({_id});
    }
    // async findAll():Promise<any>{
    //     return awaaneit UserModel.find(); 
    // }
}
