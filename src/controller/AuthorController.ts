import { Request, Response } from "express";
import { AuthorServices } from "../services/AuthorServices";
import { STATUS_CODE, INTERNAL_SERVER_ERROR } from "../constants/handle";

export class AuthorController {
    private authorServices : AuthorServices;

    constructor(authorServices: AuthorServices) {
        this.authorServices = authorServices;
    }

    async AuthorData(req: Request, res: Response): Promise<void> {
        try {
            await this.authorServices.authorData(req, res);
            res.send('SHOW IN CONSOLE');
        } catch (error) {
            console.error("Error:", error);
            res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR);
        }
    }
    async findAuthor(req: Request, res: Response) {
        try {
            const { search, page = 1, limit = 10 } = req.query;
            const { users, total_pages } = await this.authorServices.findAuthor(search as string, +page, +limit);
    
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
    async deleteAuthor(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, _id } = req.body;
            await this.authorServices.delete(email, password, _id);
            res.send("User deleted successfully");
        } catch (error) {
            console.error("Error:", error);
            res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR);
        }
    }
    async updateAuthor(req: Request, res: Response): Promise<void> {
        try {
            const { _id,email,password } = req.body;
            const updatedData = req.body; // Pass the whole body as updated data
            await this.authorServices.updateAuthor(email,password,_id, updatedData);
            res.send("Author updated successfully");
        } catch (error) {
            console.error("Error:", error);
            res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR);
        }
    }
}
