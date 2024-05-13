import { Request, Response } from "express";
import { UserServices } from "../services/UserServices";
import { INTERNAL_SERVER_ERROR, STATUS_CODE, NOT_FOUND, SUCCESS_MESSAGE } from "../constants/handle";
import { inject } from "inversify";
import {TYPES} from "../type/types"
import { controller, httpDelete, httpGet, httpPost } from "inversify-express-utils";
import { Auth } from "../middleware/Auth";
import * as yup from 'yup'

@controller('/user')
export class UserController {
    private userServices: UserServices;

    constructor(@inject (TYPES.UserServices) userServices: UserServices) {
        this.userServices = userServices;
    }

    @httpPost("/InsertData")
    async Userdata(req: Request, res: Response): Promise<void> {
        try {
            await this.userServices.userData(req, res);
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

    @httpPost("/find")
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const token = await this.userServices.login(email, password);
            if (token) {
                res.cookie('token', token, { secure: false, httpOnly: true });
                res.status(STATUS_CODE.SUCCESS).send(SUCCESS_MESSAGE);
            } else {
                res.status(STATUS_CODE.NOT_FOUND).send(NOT_FOUND);
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send(INTERNAL_SERVER_ERROR);
        }
    }

    @httpPost('/deleteUser',Auth)
    async deleteUSer(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, _id } = req.body;
            await this.userServices.delete(email, password, _id);
            res.send("User deleted successfully");
        } catch (error) {
            console.error("Error:", error);
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send(INTERNAL_SERVER_ERROR);
        }
    }

    @httpGet('/findUser',Auth)
    async findAll(req: Request, res: Response) {
        try {
            const {filter, search, page = 1, limit = 10 } = req.query;
            const { users, total_pages } = await this.userServices.findAll(filter as string,search as string, +page, +limit);
    
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
}