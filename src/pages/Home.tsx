import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { AuthorBook } from '../interfaces/Author';
import { Book } from '../interfaces/Book';
import { User } from '../interfaces/User';

function Home() {
    const [authors, setAuthors] = useState<AuthorBook[]>([]);

    const [books, setBooks] = useState<Book[]>([]);

    const [user, setUser] = useState<User>({
        userId: 0,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
        dateOfBirth: ''
    });

    useEffect(() => {
        fetchAuthors();
        fetchBooks();
        fetchUserDetails();
    }, []);

    const fetchAuthors = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/authors');
            setAuthors(response.data);
        } catch (error) {
            toast.error("Failed to fetch authors.");
        }
    };

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/books');
            setBooks(response.data);
        } catch (error) {
            toast.error("Failed to fetch books.");
        }
    };

    const fetchUserDetails = async () => {
        const token = localStorage.getItem('authToken');
        if (!token)
            return;

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const response = await axios.get(`http://localhost:8080/api/users/${decodedToken.sub}`, {
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }
        });
        setUser(response.data);
    };

    const loanBook = async (isbn: string, title: string) => {
        try {
            const token = localStorage.getItem('authToken');
            const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;

            const userDetails = await axios.get(`http://localhost:8080/api/users/${decodedToken.sub}`, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            setUser(userDetails.data);

            await axios.post('http://localhost:8080/api/users/loanBook', {
                'userId': user.userId,
                'bookISBN': isbn
            }, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            toast.success(`You have sucessfully loaned ${title}.`);
            fetchBooks();
        } catch (error: any) {
            if (error.response.data === "There is an active book loan for the given userId and bookISBN combination. You cannot loan the same book twice. Please return the book first.")
                toast.error("You have already loaned this book out.");

            console.log(error)
        }
    }

    const getAuthorNames = (authorIds: number[]): string => {
        const authorNames = authorIds.map(id => authors.find(author => author.authorId === id)?.name).filter(name => name);
        return authorNames.join(', ');
    };

    return (
        <>
            <NavBar />
            <div className="container mt-4">
                {books.length === 0 ? (
                    <p>There are no books in the database right now.</p>
                ) : (
                    <div className="row">
                        {books.filter((book) => book.available).map((book) => (
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
                                        {user.role === 'STUDENT' && (
                                            <button type="button" className="btn btn-success" onClick={() => loanBook(book.isbn, book.title)}>Loan</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <ToastContainer />
            </div>
        </>
    );
}

export default Home;