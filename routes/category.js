const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/category');
const authenticateToken = require('../config/validation');

// Route for creating a new category
router.post('/store', authenticateToken, categoriesController.store);

// Route for updating a category
router.post('/update/:categoryId', authenticateToken, categoriesController.update);

// Route for deleting a category
router.delete('/remove/:categoryId', authenticateToken, categoriesController.delete);

// Route for fetching all categories
router.get('/list', authenticateToken, categoriesController.getAll);
router.get('/enabled_categories', authenticateToken, categoriesController.getEnabledCategories);
router.get('/:category_id', authenticateToken, categoriesController.index);

module.exports = router;