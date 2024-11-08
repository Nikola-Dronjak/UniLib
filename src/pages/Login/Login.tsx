import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { validateLogin } from './validateLogin';

function Login() {
    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        setErrors({});

        const validationErrors = await validateLogin(user);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            axios.post('http://localhost:8080/api/users/login', user)
                .then((response) => {
                    if (response.status === 200) {
                        const token = response.data;
                        const decodedToken = JSON.parse(atob(token.split('.')[1]));
                        localStorage.setItem('authToken', token);

                        if (decodedToken.role === "ADMINISTRATOR") {
                            navigate('/admin');
                        } else {
                            navigate('/home');
                        }
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
                <form onSubmit={handleLogin}>
                    <div className="form-group mt-3">
                        <label htmlFor="emailLogin">Email:</label>
                        <input type="text" id="emailLogin" className="form-control" placeholder="Enter your email address" name="email" onChange={(e) => setUser({ ...user, email: e.target.value?.trim() || '' })} />
                        <span className="text-danger">{errors.email}</span>
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="passwordLogin">Password:</label>
                        <input type="password" id="passwordLogin" className="form-control" placeholder="Enter your password" name="password" onChange={(e) => setUser({ ...user, password: e.target.value?.trim() || '' })} />
                        <span className="text-danger">{errors.password}</span>
                    </div>
                    <div className="col text-center">
                        <button type="submit" className="btn btn-primary mt-4">Login</button>
                    </div>
                </form>
                <p className="mt-3 text-center">
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </div>
            <ToastContainer />
        </div>
    )

}

export default Login