import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Authors from './pages/Admin/Author/Authors';
import AddAuthor from './pages/Admin/Author/AddAuthor';
import Books from './pages/Admin/Book/Books';
import AddBook from './pages/Admin/Book/AddBook';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin/authors' element={<Authors />} />
        <Route path='/admin/authors/add' element={<AddAuthor />} />
        <Route path='/admin/books' element={<Books />} />
        <Route path='/admin/books/add' element={<AddBook />} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;
