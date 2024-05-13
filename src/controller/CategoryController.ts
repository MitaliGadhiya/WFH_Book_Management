import { Request, Response } from 'express'
import { CategoryServices } from '../services/CategoryServices'
import { STATUS_CODE, INTERNAL_SERVER_ERROR } from '../constants/handle'
import { inject, injectable } from 'inversify'
import { TYPES } from '../type/types'
import { controller, httpPost } from 'inversify-express-utils'
import { Auth } from '../middleware/Auth'
import * as yup from 'yup'

@controller('/category')
export class CategoryController {
  private categoryServices: CategoryServices

  constructor(
    @inject(TYPES.CategoryServices) categoryServices: CategoryServices
  ) {
    this.categoryServices = categoryServices
  }

  @httpPost('/InsertData', Auth)
  async Userdata(req: Request, res: Response): Promise<void> {
    try {
      await this.categoryServices.categoryData(req, res)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // If validation fails, send validation error messages in response
        const validationErrors = error.errors
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ error: 'Validation Error', validationErrors })
      } else {
        // If other error occurs, send internal server error response
        console.error('Error:', error)
        res
          .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
          .send(INTERNAL_SERVER_ERROR)
      }
    }
  }

  @httpPost('/findCategory', Auth)
  async findCategory(req: Request, res: Response) {
    try {
      const { filter, search, page = 1, limit = 10 } = req.query
      const { users, total_pages } = await this.categoryServices.findAll(
        filter as string,
        search as string,
        +page,
        +limit
      )

      res.json({
        total_pages,
        current_page: page,
        users
      })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  @httpPost('/deleteCategory', Auth)
  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, _id } = req.body
      await this.categoryServices.delete(email, password, _id)
      res.send('category deleted successfully')
    } catch (error) {
      console.error('Error:', error)
      res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR)
    }
  }

  @httpPost('/updateCategory', Auth)
  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { _id, email, password } = req.body
      const updatedData = req.body // Pass the whole body as updated data
      await this.categoryServices.updateCategory(
        email,
        password,
        _id,
        updatedData
      )
      res.send('Category updated successfully')
    } catch (error) {
      console.error('Error:', error)
      res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR)
    }
  }
}
