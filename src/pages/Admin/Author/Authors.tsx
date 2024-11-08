import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Authors() {
    interface Author {
        authorId: number;
        name: string;
        dateOfBirth: string;
        dateOfDeath: string;
    }

    const [authors, setAuthors] = useState<Author[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAuthors();
    }, []);

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

    const removeAuthor = async (authorId: number) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.delete(`http://localhost:8080/api/authors/${authorId}`, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            toast.success("Author removed successfully.");
            fetchAuthors();
        } catch (error) {
            toast.error("Failed to remove author.");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('de-DE').format(date);
    };

    return (
        <div className="container mt-4">
            {authors.length === 0 ? (
                <p>There are no authors in the database right now.</p>
            ) : (
                <div className="row">
                    {authors.map((author) => (
                        <div key={author.authorId} className="col-md-4 col-sm-6 mb-4">
                            <div className="card p-4 h-100">
                                <div className="form-group mt-3 text-center">
                                    <h2>{author.name}</h2>
                                    <p>{formatDate(author.dateOfBirth)} - {formatDate(author.dateOfDeath)}</p>
                                </div>
                                <div className="d-flex justify-content-around mt-4">
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate(`/admin/authors/update/${author.authorId}`)}>Update</button>
                                    <button type="button" className="btn btn-danger" onClick={() => removeAuthor(author.authorId)}>Remove</button>
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

export default Authors