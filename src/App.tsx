import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import AddAuthor from './pages/Admin/Author/AddAuthor';
import AddBook from './pages/Admin/Book/AddBook';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin/authors/add' element={<AddAuthor />} />
        <Route path='/admin/books/add' element={<AddBook />} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;
