import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRETKEY } from '../constants/handle';
import { BaseMiddleware } from 'inversify-express-utils';

export class Auth extends BaseMiddleware {
    handler(req: Request, res: Response, next: NextFunction): void {
        const token = req.cookies.token;
        console.log(token);
        if (!token) {
            res.status(401).send('Unauthorized');
            return;
        }

        jwt.verify(token, SECRETKEY, (err: any, decoded: any) => {
            if (err) {
                res.status(403).send('Forbidden');
                return;
            }
            req.find = decoded; // Assuming the decoded token contains user information
            next();
        });
    }
}
