import { Request, Response } from 'express'
import { BooksServices } from '../services'
import { STATUS_CODE, INTERNAL_SERVER_ERROR } from '../utils/constants/handle'
import { inject, injectable } from 'inversify'
import { TYPES } from '../utils/type/types'
import { controller, httpGet, httpPost } from 'inversify-express-utils'
import { Auth } from '../middleware/Auth'
import { validateData } from '../middleware/validationMiddleware'

@controller('/book')
export class BookController {
  private booksServices: BooksServices

  constructor(@inject(TYPES.BooksServices) booksServices: BooksServices) {
    this.booksServices = booksServices
  }

  @httpPost('/InsertData', Auth, validateData)
  async Userdata(req: Request, res: Response): Promise<void> {
    try {
      await this.booksServices.booksdata(req, res)
    } catch (error) {
        res
          .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
          .send(INTERNAL_SERVER_ERROR)
    }
  }

  @httpGet('/findBook', Auth)
  async findBook(req: Request, res: Response) {
    try {
      const { filter, search, page = 1, limit = 10 } = req.query
      const { users, total_pages } = await this.booksServices.findAll(
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

  @httpPost('/deleteBook', Auth)
  async deleteBook(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, _id } = req.body
      await this.booksServices.delete(email, password, _id)
      res.send('User deleted successfully')
    } catch (error) {
      console.error('Error:', error)
      res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR)
    }
  }

  @httpPost('/updateBook', Auth)
  async updateBook(req: Request, res: Response): Promise<void> {
    try {
      const { _id, email, password } = req.body
      const updatedData = req.body // Pass the whole body as updated data
      await this.booksServices.updateBook(email, password, _id, updatedData)
      res.send('Book updated successfully')
    } catch (error) {
      console.error('Error:', error)
      res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR)
    }
  }
}
