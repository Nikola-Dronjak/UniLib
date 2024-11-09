import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import NavBar from '../../../components/NavBar';
import { AuthorBook } from '../../../interfaces/Author';
import { Book } from '../../../interfaces/Book';
import { BookGenre } from '../../../enums/BookGenre';
import { validateBook } from './validateBook';

function UpdateBook() {
    const { isbn } = useParams();
    const navigate = useNavigate();

    const [authors, setAuthors] = useState<AuthorBook[]>([]);

    const [book, setBook] = useState<Book>({
        isbn: '',
        title: '',
        genre: '',
        numberOfPages: 0,
        numberOfCopies: 0,
        available: false,
        authorIds: []
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
        const fetchBook = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`http://localhost:8080/api/books/${isbn}`, {
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'application/json'
                    }
                });
                setBook(response.data);
            } catch (error) {
                toast.error("Failed to fetch book information.");
            }
        };

        fetchBook();
    }, []);

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

    async function updateBook(e: React.FormEvent) {
        e.preventDefault();

        setErrors({});

        const validationErrors = await validateBook(book);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const token = localStorage.getItem('authToken');
            axios.put(`http://localhost:8080/api/books/${isbn}`, book, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        navigate('/admin/books');
                        setTimeout(() => {
                            toast.success("Book successfully updated.");
                        }, 10);
                    }
                })
                .catch((err) => {
                    setErrors(err.response.data);
                    toast.error(err.response.data);
                });
        }
    }

    return (
        <>
            <NavBar />
            <div className="bg-light d-flex align-items-center justify-content-center" style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                height: '100vh',
                margin: 0,
            }}>
                <div className="card p-4">
                    <form onSubmit={updateBook}>
                        <div className="form-group mt-3">
                            <label htmlFor="titleBook">Title:</label>
                            <input type="text" id="titleBook" className="form-control" placeholder="Enter the title of the book" name="title" onChange={(e) => setBook({ ...book, title: e.target.value?.trim() || '' })} value={book.title} />
                            <span className="text-danger">{errors.title}</span>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="genreBook">Genre:</label>
                            <DropdownButton id="genreBook" title={book.genre} onSelect={(selectedGenre) => setBook({ ...book, genre: selectedGenre || "" })} variant="outline-secondary">
                                {Object.keys(BookGenre).map((genreKey) => (
                                    <Dropdown.Item key={genreKey} eventKey={genreKey}>
                                        {BookGenre[genreKey as keyof typeof BookGenre]}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                            <span className="text-danger">{errors.genre}</span>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="numberOfPagesBook">Number of Pages:</label>
                            <input type="number" id="numberOfPagesBook" className="form-control" placeholder="Enter the number of pages for the book" name="numberOfPages" onChange={(e) => setBook({ ...book, numberOfPages: parseInt(e.target.value) })} value={book.numberOfPages} />
                            <span className="text-danger">{errors.numberOfPages}</span>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="numberOfCopiesBook">Number of Copies:</label>
                            <input type="number" id="numberOfCopiesBook" className="form-control" placeholder="Enter the number of copies of the book" name="numberOfCopies" onChange={(e) => setBook({ ...book, numberOfCopies: parseInt(e.target.value) })} value={book.numberOfCopies} />
                            <span className="text-danger">{errors.numberOfCopies}</span>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="authorsBook">Authors:</label>
                            <select id="authorsBook" className="form-control" name="authors" multiple onChange={(e) => { const selectedAuthorIds = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10)); setBook({ ...book, authorIds: selectedAuthorIds }); }} value={book.authorIds.map(String)}>
                                {authors.map((author) => (
                                    <option key={author.authorId} value={author.authorId}>
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
        </>
    );
}

export default UpdateBook;