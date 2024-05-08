import { Request, Response } from "express";
import { FindUser } from "../query/User";
import { Book } from "../query/Book";
import BooksModel from "../models/Books";
import { Books } from "../interface/BooksInterface";

export class BooksServices {
    private findUser: FindUser;
    private bookdata: Book;

    constructor(findUser: FindUser, bookdata: Book) {
        this.findUser = findUser;
        this.bookdata = bookdata;
    }

    async booksdata(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        const user = await this.findUser.find(email, password);
        if (user && (user.role === "admin" || user.role === "author")) {
            await this.bookdata.createBook(req, res);
            console.log("Enter data Successfully");
        } else {
            console.log("User is not an admin or Author or user not found");
        }
    }

    async findBook(search: string | undefined, page: number = 1, limit: number = 10): Promise<{ users: Books[], total_pages: number }> {
        const filter: any = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { category : {$regex: search, $options: 'i'}},
                { ISBN : {$regex: search, $options: 'i'}},
            ];
        }
    
        const users = await BooksModel.find(filter)
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();
    
        const totalCount = await BooksModel.countDocuments(filter);
        const total_pages = Math.ceil(totalCount / limit);
    
        return { users, total_pages };
    }

    async delete(email: string, password: string, _id: string): Promise<void> {
        const user = await this.findUser.find(email, password);
        if (user && user.role === "admin") {
            console.log("DELETE SUCCESSFULLY");
            await this.bookdata.DeleteBook(_id);
            console.log("SHOW THE MESSAGE ON CONSOLE");
        } else {
            console.log("User is not an admin or user not found");
        }
    }
    async updateBook(email: string, password: string,_id: string, updatedData: Partial<Book>): Promise<void> {
        const user = await this.findUser.find(email, password);
        if (user && user.role === "admin") {
        await this.bookdata.updateBook(_id, updatedData);
        console.log("SHOW THE MESSAGE ON CONSOLE");
        } else {
            console.log("User is not an admin or user not found");
        }
    }
    
}
