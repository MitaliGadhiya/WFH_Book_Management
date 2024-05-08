import { Request, Response } from "express";
import { BooksServices } from "../services/BooksServices";
import { STATUS_CODE, INTERNAL_SERVER_ERROR } from "../constants/handle";

export class BookController {
    private booksServices: BooksServices;

    constructor(booksServices: BooksServices) {
        this.booksServices = booksServices;
    }

    async BookData(req: Request, res: Response): Promise<void> {
        try {
            await this.booksServices.booksdata(req, res);
            res.send('SHOW IN CONSOLE');
        } catch (error) {
            console.error("Error:", error);
            res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR);
        }
    }
    async findBook(req: Request, res: Response) {
        try {
            const { search, page = 1, limit = 10 } = req.query;
            const { users, total_pages } = await this.booksServices.findBook(search as string, +page, +limit);
    
            res.json({
                total_pages,
                current_page: page,
                users
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async deleteBook(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, _id } = req.body;
            await this.booksServices.delete(email, password, _id);
            res.send("User deleted successfully");
        } catch (error) {
            console.error("Error:", error);
            res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR);
        }
    }
    async updateBook(req: Request, res: Response): Promise<void> {
        try {
            const { _id,email,password } = req.body;
            const updatedData = req.body; // Pass the whole body as updated data
            await this.booksServices.updateBook(email,password,_id, updatedData);
            res.send("Book updated successfully");
        } catch (error) {
            console.error("Error:", error);
            res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR);
        }
    }
}
