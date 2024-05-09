export const TYPES = {
    //user
    FindUser: Symbol.for("FindUser"),
    UserServices: Symbol.for("UserServices"),
    UserController: Symbol.for("UserController"),


    //category
    Category: Symbol.for("Category"),
    CategoryServices: Symbol.for("CategoryServices"),
    CategoryController: Symbol.for("CategoryController"),


    //book
    Book: Symbol.for("Book"),
    BooksServices: Symbol.for("BookServices"),
    BookController: Symbol.for("BookController"),


    //author
    Author: Symbol.for("Author"),
    AuthorServices: Symbol.for("AuthorServices"),
    AuthorController: Symbol.for("AuthorController"),


    //middleware
    Auth: Symbol.for("Auth")
}