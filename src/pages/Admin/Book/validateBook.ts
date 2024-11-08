export async function validateBook(book: {
    isbn: string,
    title: string,
    genre: string,
    numberOfPages: number,
    numberOfCopies: number,
    authorIds: number[]
}) {
    const errors: {
        isbn?: string,
        title?: string,
        genre?: string,
        numberOfPages?: string,
        numberOfCopies?: string,
        authorIds?: string
    } = {};

    if (!book.isbn || book.isbn.length === 0) {
        errors.isbn = "The isbn of the book is required."
    } else if (book.isbn.length !== 13) {
        errors.isbn = "The isbn of the book has to have exactly 13 characters."
    }

    if (!book.title || book.title.length === 0) {
        errors.title = "The title of the book is required."
    } else if (book.title.length < 2) {
        errors.title = "The title of the book has to have at least 2 characters."
    } else if (book.title.length > 255) {
        errors.title = "The title of the book cannot be larger than 255 characters."
    }

    if (!book.genre)
        errors.genre = "The genre of the book is required."

    if (!book.numberOfPages) {
        errors.numberOfPages = "The number of pages for the book is required."
    } else if (book.numberOfPages < 0) {
        errors.numberOfPages = "The number of pages for the book has to be a positive integer."
    }

    if (!book.numberOfCopies) {
        errors.numberOfCopies = "The number of pages for the book is required."
    } else if (book.numberOfCopies < 0) {
        errors.numberOfCopies = "The number of pages for the book has to be a positive integer."
    }

    if (!book.authorIds || book.authorIds.length < 1)
        errors.authorIds = "The author/authors of the book is/are required."

    return errors;
}