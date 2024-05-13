import { Request,Response } from "express";
import { FindUser } from "../query/User";
import { Category } from "../query/Category";
import CategoryModel from "../models/Category";
import { Category1 } from "../interface/CartegoryInterface";
import { inject, injectable } from "inversify";
import {TYPES} from "../type/types"
import * as yup from 'yup'


@injectable()
export class CategoryServices{
    private findUser: FindUser;
    private category : Category;

    constructor(@inject (TYPES.FindUser) findUser: FindUser, @inject (TYPES.Category) category: Category) {
        this.findUser = findUser;
        this.category = category;
        
    }
    async categoryData(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        const user = await this.findUser.find(email, password);
        const schema = yup.object().shape({
            name: yup.string().required('Name is required')
        });
        if (user && (user.role === "author" || user.role === "admin")) {
            await schema.validate(req.body, { abortEarly: false });
            await this.category.createCategory(req, res);
        } else {
            res.send("User is not an Author or admin or user not found");
        }
    }
    async findAll(filters: string | undefined, search: string | undefined, page: number = 1, limit: number = 10): Promise<{ users: Category1[], total_pages: number }> {
        const filter: any = {};
        const pipeline: any[] = [];
    
        // Construct the initial filter based on search criteria
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
            ];
        }
    
        // Parse and apply additional filters
        if (filters) {
            const filterPairs = filters.split('&');
            filterPairs.forEach(pair => {
                const [key, value] = pair.split('=');
                filter[key] = value;
            });
        }

        pipeline.push({ $match: filter });
        pipeline.push({ $limit: limit });
        pipeline.push({ $skip: (page - 1) * limit });
       
        const users = await CategoryModel.aggregate(pipeline);
        const totalCount = await CategoryModel.countDocuments(filter);
        const total_pages = Math.ceil(totalCount / limit);

        return { users, total_pages };
    }
    
    async delete(email: string, password: string, _id: string): Promise<void> {
        const user = await this.findUser.find(email, password);
        if (user && (user.role === "admin" || user.role === "auhtor")) {
            console.log("DELETE SUCCESSFULLY");
            await this.category.DeleteCategory(_id);
            console.log("SHOW THE MESSAGE ON CONSOLE");
        } else {
            console.log("User is not an admin or author or user not found");
        }
    }
    async updateCategory(email: string, password: string,_id: string, updatedData: Partial<Category>): Promise<void> {
        const user = await this.findUser.find(email, password);
        if (user && user.role === "author") {
        await this.category.updateAuthor(_id, updatedData);
        console.log("SHOW THE MESSAGE ON CONSOLE");
        } else {
            console.log("User is not an author or user not found");
        }
    }
    
}