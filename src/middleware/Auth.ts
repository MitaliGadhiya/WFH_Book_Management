import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRETKEY } from '../constants/handle';
import { FindUser } from "../query/User";
import { inject, injectable } from "inversify";
import { TYPES } from '../type/types';

@injectable()
export class Auth {
    private findUser: FindUser;

    constructor(@inject (TYPES.FindUser) findUser: FindUser) {
        this.findUser = findUser;
    }

    public authentication(req: Request, res: Response, next: NextFunction): void {
        const token = req.cookies.token;
        console.log(token)
        if (!token) {
            res.status(401).send('Unauthorized');
            return;
        }

        jwt.verify(token, SECRETKEY, (err: any, decoded: any) => {
            if (err) {
                res.status(403).send('Forbidden');
                return;
            }
            req.find = decoded;
            next();
        });
    }
}
