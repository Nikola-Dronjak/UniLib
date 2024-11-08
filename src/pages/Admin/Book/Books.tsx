import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Books() {
    interface Author {
        authorId: number;
        name: string;
    }

    enum BookGenre {
        NOVEL = "Novel",
        FICTION = "Fiction",
        THRILLER = "Thriller",
        HISTORY = "History",
        ROMANCE = "Romance",
        HORROR = "Horror"
    }

    interface Book {
        isbn: string;
        title: string;
        genre: BookGenre;
        numberOfPages: number;
        numberOfCopies: number;
        authorIds: number[];
    }

    const [authors, setAuthors] = useState<Author[]>([]);

    const [books, setBooks] = useState<Book[]>([]);

    const navigate = useNavigate();

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

    useEffect(() => {
        fetchBooks();
    }, []);

    const getAuthorNames = (authorIds: number[]): string => {
        const authorNames = authorIds.map(id => authors.find(author => author.authorId === id)?.name).filter(name => name);
        return authorNames.join(', ');
    };

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:8080/api/books', {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            setBooks(response.data);
        } catch (error) {
            toast.error("Failed to fetch books.");
        }
    };

    const removeBook = async (isbn: string) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.delete(`http://localhost:8080/api/books/${isbn}`, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            toast.success("Book removed successfully.");
            fetchBooks();
        } catch (error) {
            toast.error("Failed to remove book.");
        }
    };

    return (
        <div className="container mt-4">
            {books.length === 0 ? (
                <p>There are no books in the database right now.</p>
            ) : (
                <div className="row">
                    {books.map((book) => (
                        <div key={book.isbn} className="col-md-4 col-sm-6 mb-4">
                            <div className="card p-4 h-100">
                                <div className="form-group mt-3 text-center">
                                    <h2>{book.title}</h2>
                                    <p>Genre: {book.genre.toString()}</p>
                                    <p>Number of pages: {book.numberOfPages}</p>
                                    <p>In stock: {book.numberOfCopies}</p>
                                    <p>Authors: {getAuthorNames(book.authorIds)}</p>
                                </div>
                                <div className="d-flex justify-content-around mt-4">
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate(`/admin/books/update/${book.isbn}`)}>Update</button>
                                    <button type="button" className="btn btn-danger" onClick={() => removeBook(book.isbn)}>Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ToastContainer />
        </div>
    )

}

export default Books