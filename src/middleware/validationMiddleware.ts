import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { userSchema, authorSchema, categorySchema, bookSchema } from '../validators/validation';
import { STATUS_CODE } from '../utils/constants/handle';


const schemas: { [key: string]: yup.Schema<any> } = {
    '/user/InsertData': userSchema,
    '/author/InsertAuthor': authorSchema,
    '/book/InsertData': bookSchema,
    '/category/InsertData': categorySchema
   
};

export function validateData(req: Request, res: Response, next: NextFunction) {
    const route = req.path;
    const schema = schemas[route];
    if (!schema) {
    
        return next();
    } 

   
    schema.validate(req.body, { abortEarly: false })
        .then(() => {
          
            next();
        })
        .catch((error: yup.ValidationError) => {
           
            const validationErrors = error.errors;
            res.status(STATUS_CODE.BAD_REQUEST).json({ error: 'Validation Error', validationErrors });
        });
}
