import { Request,Response } from "express";
import BooksModel from "../models/Books";
import { inject, injectable } from "inversify";

@injectable()
export class Book{
    async createBook(req:Request, res:Response):Promise<void>{
        const {title,author,categoty,ISBN,description,price} = req.body
        const newBook = new BooksModel({title,author,categoty,ISBN,description,price})
        await newBook.save(); 
    }
    async findBook(req: Request, res: Response): Promise<void> {
        try {
            const books = await BooksModel.find();
            res.json(books);
        } catch (error) {
            console.error("Error finding books:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    async DeleteBook(_id: string):Promise<any>{
        return await BooksModel.deleteOne({_id});
    }
    async updateBook(_id: string, updatedData: Partial<Book>): Promise<void> {
        try {
            const updatedBook = await BooksModel.findByIdAndUpdate(_id, updatedData, { new: true });
            console.log("Book updated successfully:", updatedBook);
        } catch (error) {
            console.error("Error updating book:", error);
        }
    }
}