import { Request, Response } from "express";
import { UserServices } from "../services/UserServices";
import { INTERNAL_SERVER_ERROR, STATUS_CODE, NOT_FOUND, SUCCESS_MESSAGE } from "../constants/handle";

export class UserController {
    private userServices: UserServices;

    constructor(userServices: UserServices) {
        this.userServices = userServices;
    }

    async Userdata(req: Request, res: Response): Promise<void> {
        try {
            await this.userServices.userData(req, res);
        } catch (error) {
            console.error("Error:", error);
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send(INTERNAL_SERVER_ERROR);
        }
    }

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

    async findAll(req: Request, res: Response) {
        try {
            const { search, page = 1, limit = 10 } = req.query;
            const { users, total_pages } = await this.userServices.findAll(search as string, +page, +limit);
    
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