import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { validateBook } from './validateBook';

function Book() {
    enum BookGenre {
        NOVEL = "Novel",
        FICTION = "Fiction",
        THRILLER = "Thriller",
        HISTORY = "History",
        ROMANCE = "Romance",
        HORROR = "Horror"
    }

    interface Author {
        id: number;
        name: string;
    }

    interface BookState {
        isbn: string;
        title: string;
        genre: string;
        numberOfPages: number;
        numberOfCopies: number;
        authors: string[];
    }

    const [authors, setAuthors] = useState<Author[]>([]);;

    const [book, setBook] = useState<BookState>({
        isbn: '',
        title: '',
        genre: '',
        numberOfPages: 0,
        numberOfCopies: 0,
        authors: []
    });

    const [errors, setErrors] = useState<{
        isbn?: string,
        title?: string,
        genre?: string,
        numberOfPages?: string,
        numberOfCopies?: string;
        authors?: string;
    }>({});

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:8080/api/authors', {
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'application/json'
                    }
                });
                setAuthors(response.data);
            } catch (error) {
                toast.error("Failed to fetch authors.");
            }
        };

        fetchAuthors();
    }, []);

    async function addBook(e: React.FormEvent) {
        e.preventDefault();

        setErrors({});

        const validationErrors = await validateBook(book);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const token = localStorage.getItem('authToken');
            axios.post('http://localhost:8080/api/books', book, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        toast.success("Book successfully added.");
                    }
                })
                .catch((err) => {
                    setErrors(err.response.data);
                    toast.error(err.response.data);
                });
        }
    }

    return (
        <div className="bg-light d-flex align-items-center justify-content-center" style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            height: '100vh',
            margin: 0,
        }}>
            <div className="card p-4">
                <form onSubmit={addBook}>
                    <div className="form-group mt-3">
                        <label htmlFor="isbnBook">ISBN:</label>
                        <input type="text" id="isbnBook" className="form-control" placeholder="Enter the isbn of the book" name="isbn" onChange={(e) => setBook({ ...book, isbn: e.target.value?.trim() || '' })} />
                        <span className="text-danger">{errors.isbn}</span>
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="titleBook">Title:</label>
                        <input type="text" id="titleBook" className="form-control" placeholder="Enter the title of the book" name="title" onChange={(e) => setBook({ ...book, title: e.target.value?.trim() || '' })} />
                        <span className="text-danger">{errors.title}</span>
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="genreBook">Genre:</label>
                        <select id="genreBook" className="form-control" name="genre" onChange={(e) => setBook({ ...book, genre: e.target.value })} value={book.genre || ""}>
                            {Object.keys(BookGenre).map((genreKey) => (
                                <option key={genreKey} value={genreKey}>
                                    {BookGenre[genreKey as keyof typeof BookGenre]}
                                </option>
                            ))}
                        </select>
                        <span className="text-danger">{errors.genre}</span>
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="numberOfPagesBook">Number of Pages:</label>
                        <input type="number" id="numberOfPagesBook" className="form-control" placeholder="Enter the number of pages for the book" name="numberOfPages" onChange={(e) => setBook({ ...book, numberOfPages: parseInt(e.target.value) })} />
                        <span className="text-danger">{errors.numberOfPages}</span>
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="numberOfCopiesBook">Number of Copies:</label>
                        <input type="number" id="numberOfCopiesBook" className="form-control" placeholder="Enter the number of copies of the book" name="numberOfCopies" onChange={(e) => setBook({ ...book, numberOfCopies: parseInt(e.target.value) })} />
                        <span className="text-danger">{errors.numberOfCopies}</span>
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="authorsBook">Authors:</label>
                        <select id="authorsBook" className="form-control" name="authors" multiple onChange={(e) => { const selectedAuthors = Array.from(e.target.selectedOptions, option => option.value); setBook({ ...book, authors: selectedAuthors }); }} value={book.authors || []}>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.name}
                                </option>
                            ))}
                        </select>
                        <span className="text-danger">{errors.authors}</span>
                    </div>
                    <div className="col text-center">
                        <button type="submit" className="btn btn-primary mt-4">Save</button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    )

}

export default Book