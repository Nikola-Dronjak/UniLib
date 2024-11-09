import './App.css';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/myBooks' element={<MyBooks />} />
        <Route path='/admin/authors' element={<Authors />} />
        <Route path='/admin/authors/add' element={<AddAuthor />} />
        <Route path='/admin/authors/update/:authorId' element={<UpdateAuthor />} />
        <Route path='/admin/books' element={<Books />} />
        <Route path='/admin/books/add' element={<AddBook />} />
        <Route path='/admin/books/update/:isbn' element={<UpdateBook />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
