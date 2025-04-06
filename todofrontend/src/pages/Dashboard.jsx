import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', description: '' });
  const [editingBookId, setEditingBookId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', author: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const token = localStorage.getItem('token');
    if (!token) return (window.location.href = '/login');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch books');

      const data = await res.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      alert(error.message);
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBook),
      });

      const data = await res.json();
      if (res.ok) {
        setBooks((prev) => [...prev, data]);
        setNewBook({ title: '', author: '', description: '' });
      } else {
        throw new Error(data.message || 'Failed to add book');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setBooks((prev) => prev.filter((book) => book._id !== id));
      } else {
        throw new Error(data.message || 'Failed to delete book');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const startEditing = (book) => {
    setEditingBookId(book._id);
    setEditFormData({
      title: book.title,
      author: book.author,
      description: book.description,
    });
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${editingBookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();
      if (res.ok) {
        setBooks((prev) =>
          prev.map((book) => (book._id === editingBookId ? data : book))
        );
        setEditingBookId(null);
        setEditFormData({ title: '', author: '', description: '' });
      } else {
        throw new Error(data.message || 'Failed to update book');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <h2>Your Books</h2>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>

      <form className="book-form" onSubmit={handleAddBook}>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={newBook.description}
          onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
        />
        <button type="submit">Add Book</button>
      </form>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <ul className="book-list">
          {books.map((book) => (
            <li className="book-card" key={book._id}>
              {editingBookId === book._id ? (
                <form onSubmit={handleUpdateBook}>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, title: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    value={editFormData.author}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, author: e.target.value })
                    }
                    required
                  />
                  <textarea
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, description: e.target.value })
                    }
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
      )}
    </div>
  );
};

export default Dashboard;
