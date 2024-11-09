import React, { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import { validateRegister } from './validateRegister';

interface LoginProps {
    setAuthState: () => void;
}

const Register: FC<LoginProps> = ({ setAuthState }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dateOfBirth: ''
    })

    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        dateOfBirth?: string;
    }>({});

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        setErrors({});

        const validationErrors = await validateRegister(user);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            axios.post('http://localhost:8080/api/users/register', user)
                .then((response) => {
                    if (response.status === 200) {
                        const token = response.data;
                        localStorage.setItem('authToken', token);
                        setAuthState();
                        navigate('/home');
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
                    <form onSubmit={handleRegister}>
                        <div className="form-group mt-3">
                            <label htmlFor="firstNameLogin">First name:</label>
                            <input type="text" id="firstNameLogin" className="form-control" placeholder="Enter your first name" name="firstName" onChange={(e) => setUser({ ...user, firstName: e.target.value?.trim() || '' })} />
                            <span className="text-danger">{errors.firstName}</span>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="lastNameLogin">Last name:</label>
                            <input type="text" id="lastNameLogin" className="form-control" placeholder="Enter your last name" name="lastName" onChange={(e) => setUser({ ...user, lastName: e.target.value?.trim() || '' })} />
                            <span className="text-danger">{errors.lastName}</span>
                        </div>
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
                        <div className="form-group mt-3">
                            <label htmlFor="dateOfBirthLogin">Date of birth:</label>
                            <input type="date" id="dateOfBirthLogin" className="form-control" name="dateOfBirth" onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value || '' })} />
                            <span className="text-danger">{errors.dateOfBirth}</span>
                        </div>
                        <div className="col text-center">
                            <button type="submit" className="btn btn-primary mt-4">Sign up!</button>
                        </div>
                    </form>
                    <p className="mt-3 text-center">Already have an account? <a href='/login'>Sign in</a></p>
                </div>
                <ToastContainer />
            </div>
        </>
    )

}

export default Register