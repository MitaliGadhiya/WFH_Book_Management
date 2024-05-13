import { Request, Response } from "express";
import { AuthorServices } from "../services/AuthorServices";
import { STATUS_CODE, INTERNAL_SERVER_ERROR } from "../constants/handle";
import { inject, injectable } from "inversify";
import {TYPES} from "../type/types"
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { Auth } from "../middleware/Auth";
import *  as yup from 'yup'

@controller('/author')
export class AuthorController {
    private authorServices : AuthorServices;

    constructor(@inject (TYPES.AuthorServices) authorServices: AuthorServices) {
        this.authorServices = authorServices;
    }

    @httpPost('/InsertAuthor', Auth)
    async Userdata(req: Request, res: Response): Promise<void> {
        try {
            await this.authorServices.authorData(req, res);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                // If validation fails, send validation error messages in response
                const validationErrors = error.errors;
                res.status(STATUS_CODE.BAD_REQUEST).json({ error: 'Validation Error', validationErrors });
            } else {
                // If other error occurs, send internal server error response
                console.error('Error:', error);
                res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send(INTERNAL_SERVER_ERROR);
            }
        }
    }

    @httpGet("/findAuthor" ,Auth)
    async findAuthor(req: Request, res: Response) {
        try {
            const { filter, search, page = 1, limit = 10 } = req.query;
            const { users, total_pages } = await this.authorServices.findAll(filter as string, search as string, +page, +limit);
    
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

    @httpPost("/deleteAuthor", Auth)
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

    @httpPost('/updateAuthor', Auth)
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
