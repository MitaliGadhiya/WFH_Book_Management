import { Request, Response } from "express";
import { CategoryServices } from "../services/CategoryServices";
import { STATUS_CODE, INTERNAL_SERVER_ERROR } from "../constants/handle";

export class CategoryController {
    private categoryServices : CategoryServices;

    constructor(categoryServices: CategoryServices) {
        this.categoryServices = categoryServices;
    }

    async categoryData(req: Request, res: Response): Promise<void> {
        try {
            await this.categoryServices.categoryData(req, res);
            res.send('SHOW IN CONSOLE');
        } catch (error) {
            console.error("Error:", error);
            res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR);
        }
    }
    async findCategory(req: Request, res: Response) {
        try {
            const { search, page = 1, limit = 10 } = req.query;
            const { users, total_pages } = await this.categoryServices.findAll(search as string, +page, +limit);
    
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
    async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, _id } = req.body;
            await this.categoryServices.delete(email, password, _id);
            res.send("category deleted successfully");
        } catch (error) {
            console.error("Error:", error);
            res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR);
        }
    }
    async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const { _id,email,password } = req.body;
            const updatedData = req.body; // Pass the whole body as updated data
            await this.categoryServices.updateCategory(email,password,_id, updatedData);
            res.send("Category updated successfully");
        } catch (error) {
            console.error("Error:", error);
            res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR);
        }
    }
}