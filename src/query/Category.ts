import { Request,Response } from "express";
import CategoryModel from "../models/Category";
import {injectable } from "inversify";

@injectable()
export class Category{
    async createCategory(req:Request, res:Response):Promise<void>{
        const {name} = req.body
        const newAuthor = new CategoryModel({name})
        await newAuthor.save(); 
    }
    async DeleteCategory(_id: string):Promise<any>{
        return await CategoryModel.deleteOne({_id});
    }
    async updateAuthor(_id: string, updatedData: Partial<Category>): Promise<void> {
        try {
            const updatedCategory = await CategoryModel.findByIdAndUpdate(_id, updatedData, { new: true });
            console.log("Category updated successfully:", updatedCategory);
        } catch (error) {
            console.error("Error updating Category:", error);
        }
    }
}