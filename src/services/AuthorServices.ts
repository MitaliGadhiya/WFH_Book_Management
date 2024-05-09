import { Request,Response } from "express";
import { FindUser } from "../query/User";
import { Author } from "../query/Author";
import { Author1 } from "../interface/AuthorsInterface";
import AuthorModel from "../models/Author";
import { inject, injectable } from "inversify";
import {TYPES} from "../type/types"


@injectable()
export class AuthorServices{
    private findUser: FindUser;
    private author : Author;

    constructor(@inject (TYPES.FindUser) findUser: FindUser,@inject (TYPES.Author) author: Author) {
        this.findUser = findUser;
        this.author = author;
        
    }
    async authorData(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        const user = await this.findUser.find(email, password);
        if (user && (user.role === "author")) {
            await this.author.createAuthor(req, res);
            console.log("Enter data successfully")
        } else {
            console.log("User is not an Author or user not found");
        }
    }
    async findAuthor(search: string | undefined, page: number = 1, limit: number = 10): Promise<{ users: Author1[], total_pages: number }> {
        const filter: any = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { biography: { $regex: search, $options: 'i' } },
                { nationality : {$regex: search, $options: 'i'}},
            ];
        }
    
        const users = await AuthorModel.find(filter)
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();
    
        const totalCount = await AuthorModel.countDocuments(filter);
        const total_pages = Math.ceil(totalCount / limit);
    
        return { users, total_pages };
    }
    async delete(email: string, password: string, _id: string): Promise<void> {
        const user = await this.findUser.find(email, password);
        if (user && (user.role === "admin" || user.role === "auhtor")) {
            console.log("DELETE SUCCESSFULLY");
            await this.author.DeleteAuthor(_id);
            console.log("SHOW THE MESSAGE ON CONSOLE");
        } else {
            console.log("User is not an admin or author or user not found");
        }
    }
    async updateAuthor(email: string, password: string,_id: string, updatedData: Partial<Author>): Promise<void> {
        const user = await this.findUser.find(email, password);
        if (user && user.role === "author") {
        await this.author.updateAuthor(_id, updatedData);
        console.log("SHOW THE MESSAGE ON CONSOLE");
        } else {
            console.log("User is not an author or user not found");
        }
    }
    
}