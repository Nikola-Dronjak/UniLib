import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import { User } from '../../interfaces/User';
import { validateRegister } from '../Register/validateRegister';

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User>({
        userId: 0,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
        dateOfBirth: ''
    });

    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        dateOfBirth?: string;
    }>({});

    useEffect(() => {
        fetchUserDetails();
    }, []);

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

    async function updateUser(e: React.FormEvent) {
        e.preventDefault();

        setErrors({});

        const validationErrors = await validateRegister(user);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const token = localStorage.getItem('authToken');
            axios.put(`http://localhost:8080/api/users/${user.userId}`, user, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        navigate('/profile');
                        setTimeout(() => {
                            toast.success("Profile successfully updated.");
                        }, 10);
                    }
                })
                .catch((err) => {
                    setErrors(err.response.data);
                    toast.error(err.response.data);
                });
        }
    }

    const removeUser = async (userId: number) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:8080/api/users/${userId}`, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            localStorage.removeItem('authToken');
            navigate('/home');
            setTimeout(() => {
                toast.success("Profile successfully removed.");
            }, 10);
        } catch (error) {
            toast.error("Failed to remove profile.");
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString)
            return '';

        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

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
                    <form onSubmit={updateUser}>
                        <div className="form-group mt-3">
                            <label htmlFor="firstNameUser">First name:</label>
                            <input type="text" id="firstNameUser" className="form-control" placeholder="Enter your first name" name="firstName" onChange={(e) => setUser({ ...user, firstName: e.target.value?.trim() || '' })} value={user.firstName} />
                            <span className="text-danger">{errors.firstName}</span>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="lastNameUser">Last name:</label>
                            <input type="text" id="lastNameUser" className="form-control" placeholder="Enter your last name" name="lastName" onChange={(e) => setUser({ ...user, lastName: e.target.value?.trim() || '' })} value={user.lastName} />
                            <span className="text-danger">{errors.lastName}</span>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="emailUser">Email address:</label>
                            <input type="text" id="emailUser" className="form-control" placeholder="Enter your email address" name="email" onChange={(e) => setUser({ ...user, email: e.target.value?.trim() || '' })} value={user.email} />
                            <span className="text-danger">{errors.email}</span>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="passwordUser">New password:</label>
                            <input type="password" id="passwordUser" className="form-control" placeholder="Enter your new password" name="password" onChange={(e) => setUser({ ...user, password: e.target.value?.trim() || '' })} />
                            <span className="text-danger">{errors.password}</span>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="dateOfBirthUser">Date of birth:</label>
                            <input type="date" id="dateOfBirthUser" className="form-control" name="dateOfBirth" onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value || '' })} value={formatDate(user.dateOfBirth)} />
                            <span className="text-danger">{errors.dateOfBirth}</span>
                        </div>
                        <div className="col text-center">
                            <button type="submit" className="btn btn-primary mt-4">Save</button>
                            <button type="button" className="btn btn-danger" onClick={() => removeUser(user.userId)}>Remove</button>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </>
    );
}

export default Profile;