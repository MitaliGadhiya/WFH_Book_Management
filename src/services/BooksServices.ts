import { Request, Response } from 'express'
import { FindUser } from '../query/User'
import { Book } from '../query/Book'
import BooksModel from '../models/Books'
import { Books } from '../interface/BooksInterface'
import { inject, injectable } from 'inversify'
import { TYPES } from '../utils/type/types'

@injectable()
export class BooksServices {
  private findUser: FindUser
  private bookdata: Book

  constructor(
    @inject(TYPES.FindUser) findUser: FindUser,
    @inject(TYPES.Book) bookdata: Book
  ) {
    this.findUser = findUser
    this.bookdata = bookdata
  }

  async booksdata(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body
    const user = await this.findUser.find(email, password)
    
    if (user && (user.role === 'admin' || user.role === 'author')) {
      
      await this.bookdata.createBook(req, res)
    } else {
      res.send('User is not an admin or Author or user not found')
    }
  }

  async findAll(
    filters: string | undefined,
    search: string | undefined,
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: Books[]; total_pages: number }> {
    const filter: any = {}
    const pipeline: any[] = []

    // Construct the initial filter based on search criteria
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { ISBN: { $regex: search, $options: 'i' } }
      ]
    }

    // Parse and apply additional filters
    if (filters) {
      const filterPairs = filters.split('&')
      filterPairs.forEach(pair => {
        const [key, value] = pair.split('=')
        filter[key] = value
      })
    }

    pipeline.push({ $match: filter })
    pipeline.push({ $limit: limit })
    pipeline.push({ $skip: (page - 1) * limit })

    const users = await BooksModel.aggregate(pipeline)
    const totalCount = await BooksModel.countDocuments(filter)
    const total_pages = Math.ceil(totalCount / limit)

    return { users, total_pages }
  }

  async delete(email: string, password: string, _id: string): Promise<void> {
    const user = await this.findUser.find(email, password)
    if (user && user.role === 'admin') {
      console.log('DELETE SUCCESSFULLY')
      await this.bookdata.DeleteBook(_id)
      console.log('SHOW THE MESSAGE ON CONSOLE')
    } else {
      console.log('User is not an admin or user not found')
    }
  }
  async updateBook(
    email: string,
    password: string,
    _id: string,
    updatedData: Partial<Book>
  ): Promise<void> {
    const user = await this.findUser.find(email, password)
    if (user && user.role === 'admin') {
      await this.bookdata.updateBook(_id, updatedData)
      console.log('SHOW THE MESSAGE ON CONSOLE')
    } else {
      console.log('User is not an admin or user not found')
    }
  }
}
