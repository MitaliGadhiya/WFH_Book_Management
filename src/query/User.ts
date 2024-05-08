import UserModel from "../models/user";


export class FindUser{
    async find(email : string, password: string) : Promise<any>{
        return await UserModel.findOne({email, password });
    }
    async delete(_id: string): Promise<any>{
        return await UserModel.deleteOne({_id});
    }
    // async findAll():Promise<any>{
    //     return await UserModel.find(); 
    // }
}
