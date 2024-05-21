import { Request, Response } from 'express'
import { STATUS_CODE, INTERNAL_SERVER_ERROR } from '../utils/constants/handle'
import { inject, injectable } from 'inversify'
import { TYPES } from '../utils/type/types'
import { controller, httpGet, httpPost } from 'inversify-express-utils'
import { Auth } from '../middleware/Auth'
import { validateData } from '../middleware/validationMiddleware'
import { AuthorServices } from '../services/AuthorServices'

@controller('/author')
export class AuthorController {
  private authorServices: AuthorServices

  constructor(@inject(TYPES.AuthorServices) authorServices: AuthorServices) {
    this.authorServices = authorServices
  }

  @httpPost('/InsertAuthor',Auth,validateData)
  async Userdata(req: Request, res: Response): Promise<void> {
    try {
      await this.authorServices.authorData(req, res)
    } catch (error) {
        res
          .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
          .send(INTERNAL_SERVER_ERROR)
      }
  }

  @httpGet('/findAuthor', Auth)
  async findAuthor(req: Request, res: Response) {
    try {
      const { filter, search, page = 1, limit = 10 } = req.query
      const { users, total_pages } = await this.authorServices.findAll(
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

  @httpPost('/deleteAuthor', Auth)
  async deleteAuthor(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, _id } = req.body
      await this.authorServices.delete(email, password, _id)
      res.send('User deleted successfully')
    } catch (error) {
      console.error('Error:', error)
      res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR)
    }
  }

  @httpPost('/updateAuthor', Auth)
  async updateAuthor(req: Request, res: Response): Promise<void> {
    try {
      const { _id, email, password } = req.body
      const updatedData = req.body // Pass the whole body as updated data
      await this.authorServices.updateAuthor(email, password, _id, updatedData)
      res.send('Author updated successfully')
    } catch (error) {
      console.error('Error:', error)
      res.status(STATUS_CODE.NOT_FOUND).send(INTERNAL_SERVER_ERROR)
    }
  }
}
