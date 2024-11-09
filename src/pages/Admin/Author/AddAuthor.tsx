import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import NavBar from '../../../components/NavBar';
import { Author } from '../../../interfaces/Author';
import { validateAuthor } from './validateAuthor';

function AddAuthor() {
    const navigate = useNavigate();

    const [author, setAuthor] = useState<Author>({
        name: '',
        dateOfBirth: '',
        dateOfDeath: ''
    });

    const [errors, setErrors] = useState<{
        name?: string;
        dateOfBirth?: string;
        dateOfDeath?: string;
    }>({});

    async function addAuthor(e: React.FormEvent) {
        e.preventDefault();

        setErrors({});

        const validationErrors = await validateAuthor(author);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const token = localStorage.getItem('authToken');
            axios.post('http://localhost:8080/api/authors', author, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        navigate('/admin/authors');
                        setTimeout(() => {
                            toast.success("Author successfully added.");
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
                    <form onSubmit={addAuthor}>
                        <div className="form-group mt-3">
                            <label htmlFor="nameAuthor">Name:</label>
                            <input type="text" id="nameAuthor" className="form-control" placeholder="Enter the author's name" name="name" onChange={(e) => setAuthor({ ...author, name: e.target.value?.trim() || '' })} />
                            <span className="text-danger">{errors.name}</span>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="dateOfBirthAuthor">Date of birth:</label>
                            <input type="date" id="dateOfBirthAuthor" className="form-control" name="dateOfBirth" onChange={(e) => setAuthor({ ...author, dateOfBirth: e.target.value || '' })} />
                            <span className="text-danger">{errors.dateOfBirth}</span>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="dateOfDeathAuthor">Date of death:</label>
                            <input type="date" id="dateOfDeathAuthor" className="form-control" name="dateOfDeath" onChange={(e) => setAuthor({ ...author, dateOfDeath: e.target.value || '' })} />
                            <span className="text-danger">{errors.dateOfDeath}</span>
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

export default AddAuthor;