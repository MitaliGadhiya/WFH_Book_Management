import { Request, Response } from "express";
import UserModel from "../models/user";
import { User } from "../interface/User";
import jwt from "jsonwebtoken";
import { SECRETKEY } from "../constants/handle";
import { FindUser } from "../query/User";
import { inject, injectable } from "inversify";
import {TYPES} from "../type/types"
import * as yup from "yup"

@injectable()
export class UserServices {
    private findUser: FindUser;

    constructor(@inject (TYPES.FindUser) findUser: FindUser) {
        this.findUser = findUser;
    }

    async userData(req: Request, res: Response): Promise<void> {
        // Define validation schema using Yup
        const schema = yup.object().shape({
            name: yup.string().required('name is required'),
            email: yup.string().email('invalid email-id').required('email id is required'),
            password: yup.string().required('password must be required'),
            role: yup.string().required('role is required')
        });
    
        // Validate request body against the schema
        await schema.validate(req.body, { abortEarly: false });
    
        // If validation passes, create and save new user
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
    
    async findAll(filters: string | undefined, search: string | undefined, page: number = 1, limit: number = 10): Promise<{ users: User[], total_pages: number }> {
        const filter: any = {};
        const pipeline: any[] = [];
    
        // Construct the initial filter based on search criteria
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } }
            ];
        }
    
        // Parse and apply additional filters
        if (filters) {
            const filterPairs = filters.split('&');
            filterPairs.forEach(pair => {
                const [key, value] = pair.split('=');
                filter[key] = value;
            });
        }

        pipeline.push({ $match: filter });
        pipeline.push({ $limit: limit });
        pipeline.push({ $skip: (page - 1) * limit });
       
        const users = await UserModel.aggregate(pipeline);
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