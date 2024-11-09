import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Home from './pages/Home';
import Profile from './pages/User/Profile';
import MyBooks from './pages/User/MyBooks';
import Authors from './pages/Admin/Author/Authors';
import AddAuthor from './pages/Admin/Author/AddAuthor';
import UpdateAuthor from './pages/Admin/Author/UpdateAuthor';
import Books from './pages/Admin/Book/Books';
import AddBook from './pages/Admin/Book/AddBook';
import UpdateBook from './pages/Admin/Book/UpdateBook';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        setAuthState();
    }, []);

    const setAuthState = () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUserRole(decodedToken.role);
            setIsAuthenticated(true);
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="/register" element={<Register setAuthState={setAuthState} />} />
                <Route path="/login" element={<Login setAuthState={setAuthState} />} />
                <Route path="/home" element={<Home />} />

                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['STUDENT']} userRole={userRole} />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/myBooks" element={<MyBooks />} />
                </Route>

                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedRoles={['ADMINISTRATOR']} userRole={userRole} />}>
                    <Route path="/admin/authors" element={<Authors />} />
                    <Route path="/admin/authors/add" element={<AddAuthor />} />
                    <Route path="/admin/authors/update/:authorId" element={<UpdateAuthor />} />
                    <Route path="/admin/books" element={<Books />} />
                    <Route path="/admin/books/add" element={<AddBook />} />
                    <Route path="/admin/books/update/:isbn" element={<UpdateBook />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
