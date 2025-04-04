const Book = require('../models/Book');

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user.id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books' });
  }
};

// Add a new book
exports.addBook = async (req, res) => {
  try {
    const { title, author, description } = req.body;
    const newBook = new Book({
      title,
      author,
      description,
      userId: req.user.id
    });
    const saved = await newBook.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error creating book' });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
