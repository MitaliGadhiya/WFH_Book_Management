import { Request, Response } from "express";
import UserModel from "../models/user";
import { User } from "../interface/User";
import jwt from "jsonwebtoken";
import { SECRETKEY } from "../constants/handle";
import { FindUser } from "../query/User";

export class UserServices {
    private findUser: FindUser;

    constructor(findUser: FindUser) {
        this.findUser = findUser;
    }

    async userData(req: Request, res: Response): Promise<void> {
        const { name, email, password, role } = req.body;
        const newUser = new UserModel({ name, email, password, role });
        await newUser.save();
        res.send("User entered successfully");
    }

    async login(email: string, password: string): Promise<string | null> {
        const user = await this.findUser.find(email, password);
        if (user) {
            const role = user.role;
            const token = jwt.sign({ email, role }, SECRETKEY, { expiresIn: '1h' });
            return token;
        } else {
            return null;
        }
    }
    
    async findAll(search: string | undefined, page: number = 1, limit: number = 10): Promise<{ users: User[], total_pages: number }> {
        const filter: any = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { role : {$regex: search, $options: 'i'}}
            ];
        }
    
        const users = await UserModel.find(filter)
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();
    
        const totalCount = await UserModel.countDocuments(filter);
        const total_pages = Math.ceil(totalCount / limit);
    
        return { users, total_pages };
    }

    
    async delete(email: string, password: string, _id: string): Promise<void> {
        const user = await this.findUser.find(email, password);
        if (user && user.role === "admin") {
            console.log("DELETE SUCCESSFULLY");
            await this.findUser.delete(_id);
            console.log("SHOW THE MESSAGE ON CONSOLE");
        } else {
            throw new Error("User is not an admin or user not found");
        }
    }
}