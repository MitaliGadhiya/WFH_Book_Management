import { Container } from 'inversify'
import { TYPES } from './type/types'
import { UserController } from './controller/UserController'
import { UserServices } from './services/UserServices'
import { FindUser } from './query/User'
import { Category } from './query/Category'
import { CategoryServices } from './services/CategoryServices'
import { CategoryController } from './controller/CategoryController'
import { Book } from './query/Book'
import { BooksServices } from './services/BooksServices'
import { BookController } from './controller/BookController'
import { Author } from './query/Author'
import { AuthorServices } from './services/AuthorServices'
import { AuthorController } from './controller/AuthorController'
import { Auth } from './middleware/Auth'

//container
const container = new Container()

//query
container.bind<FindUser>(TYPES.FindUser).to(FindUser)
container.bind<Category>(TYPES.Category).to(Category)
container.bind<Book>(TYPES.Book).to(Book)
container.bind<Author>(TYPES.Author).to(Author)

//middleware
container.bind<Auth>(Auth).toSelf()

//services
container.bind<UserServices>(TYPES.UserServices).to(UserServices)
container.bind<CategoryServices>(TYPES.CategoryServices).to(CategoryServices)
container.bind<BooksServices>(TYPES.BooksServices).to(BooksServices)
container.bind<AuthorServices>(TYPES.AuthorServices).to(AuthorServices)

//controller
container.bind<AuthorController>(TYPES.AuthorController).to(AuthorController)
container.bind<BookController>(TYPES.BookController).to(BookController)
container
  .bind<CategoryController>(TYPES.CategoryController)
  .to(CategoryController)
container.bind<UserController>(TYPES.UserController).to(UserController)

export default container
