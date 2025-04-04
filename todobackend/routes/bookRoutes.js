const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes
router.get('/', authMiddleware, bookController.getBooks);
router.post('/', authMiddleware, bookController.addBook);
router.put('/:id', authMiddleware, bookController.updateBook);
router.delete('/:id', authMiddleware, bookController.deleteBook);

module.exports = router;
