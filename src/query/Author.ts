import { Request,Response } from "express";
import AuthorModel from "../models/Author";
import { inject, injectable } from "inversify";

@injectable()
export class Author{
    async createAuthor(req:Request, res:Response):Promise<void>{
        const {name, biography, nationality} = req.body
        const newAuthor = new AuthorModel({name, biography, nationality})
        await newAuthor.save(); 
        res.send("AUTHOR DATA ENTERED SUCCESSFULLY")
    }
    async findAuthor(req: Request, res: Response): Promise<void> {
        try {
            const author = await AuthorModel.find();
            res.json(author);
        } catch (error) {
            console.error("Error finding author:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    async DeleteAuthor(_id: string):Promise<any>{
        return await AuthorModel.deleteOne({_id});
    }
    async updateAuthor(_id: string, updatedData: Partial<Author>): Promise<void> {
        try {
            const updatedBook = await AuthorModel.findByIdAndUpdate(_id, updatedData, { new: true });
            console.log("Book updated successfully:", updatedBook);
        } catch (error) {
            console.error("Error updating book:", error);
        }
    }
}