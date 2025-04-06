import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', description: '' });
  const [editingBookId, setEditingBookId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', author: '', description: '' });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/api/books`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch books');
      setBooks(data);
    } catch (error) {
      console.error('Fetch Error:', error);
      alert(error.message);
      window.location.href = '/login';
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${apiUrl}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBook)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add book');

      setBooks(prev => [...prev, data]);
      setNewBook({ title: '', author: '', description: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${apiUrl}/api/books/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete book');

      setBooks(prev => prev.filter(book => book._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  const startEditing = (book) => {
    setEditingBookId(book._id);
    setEditFormData({
      title: book.title,
      author: book.author,
      description: book.description
    });
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${apiUrl}/api/books/${editingBookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update book');

      setBooks(prev => prev.map(book => (book._id === editingBookId ? data : book)));
      setEditingBookId(null);
      setEditFormData({ title: '', author: '', description: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Your Books</h2>
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem('token');
          setBooks([]);
          window.location.href = '/login';
        }}
      >
        Logout
      </button>

      <form className="book-form" onSubmit={handleAddBook}>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
          required
        />
        <textarea
          placeholder="Description"
          value={newBook.description}
          onChange={(e) => setNewBook(prev => ({ ...prev, description: e.target.value }))}
        />
        <button type="submit">Add Book</button>
      </form>

      <ul className="book-list">
        {books.map(book => (
          <li className="book-card" key={book._id}>
            {editingBookId === book._id ? (
              <form onSubmit={handleUpdateBook}>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  value={editFormData.author}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, author: e.target.value }))}
                  required
                />
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                <button type="submit" className="edit-btn">Save</button>
                <button type="button" onClick={() => setEditingBookId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <strong>{book.title}</strong> by {book.author}
                <p>{book.description}</p>
                <button className="edit-btn" onClick={() => startEditing(book)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteBook(book._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
