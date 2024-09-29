const validator = require('validator');
const categoryModel = require("../models/category");
const historyController = require("../controllers/history");
const { ObjectId } = require('mongoose').Types;


const categories = {
    store: async (req, res, next) => {
        const { status, name } = req.body;

        // Check if the 'name' field is provided and is a non-empty string
        if (!name || !validator) {
            return res.status(400).json({ error: 'Name is required for creating a category' });
        }

        try {
            const category = new categoryModel({ status, name });

            await category.save();

            await historyController.history(req, "Category", `New category - #${name} with status (${status}) was added.`, 'added')

            return res.json({ message: 'Category created successfully', data: category });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Failed to create category: ' + error.message });
        }
    },

    index: async (req, res, next) => {
        try {
            let { category_id } = req.params;
            category_id = ObjectId(category_id);

            const categoryData = await categoryModel.findOne({_id: category_id, is_delete: false });

            return res.json({ data: categoryData });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Failed to fetch categories: ' + error.message });
        }
    },

    getAll: async (req, res, next) => {
        try {
            const allCategories = await categoryModel.find({is_delete: false }).sort({ createdOn: -1 }).exec();

            return res.json({ data: allCategories });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Failed to fetch categories: ' + error.message });
        }
    },

    getEnabledCategories: async (req, res, next) => {
        try {
            const allCategories = await categoryModel.find({ is_delete: false, status: "Enable" }).sort({ createdOn: -1 }).exec();

            return res.json({ data: allCategories });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Failed to fetch categories: ' + error.message });
        }
    },

    update: async (req, res, next) => {
        const { categoryId } = req.params;
        const { name, status } = req.body;

        try {
            const updatedCategory = await categoryModel.findOneAndUpdate(
                { _id: categoryId, is_delete: false },
                { name,status },
                { new: true }
            );

            if (!updatedCategory) {
                return res.status(404).json({ error: 'Category not found or already deleted' });
            }

            await historyController.history(req, "Category", `A category - #${name} with status (${status}) was update.`, 'updated')

            return res.json({ message: 'Category updated successfully', data: updatedCategory });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Failed to update category: ' + error.message });
        }
    },

    delete: async (req, res, next) => {
        const { categoryId } = req.params;

        try {
            const deletedCategory = await categoryModel.findOneAndUpdate(
                { _id: categoryId, is_delete: false },
                { is_delete: true },
                { new: true }
            );

            if (!deletedCategory) {
                return res.status(404).json({ error: 'Category not found or already deleted' });
            }

            const categoryData = await categoryModel.findOne({ _id: categoryId, is_delete: true }).exec();

            await historyController.history(req, "Category", `A category - #${categoryData.name} with status (${categoryData.status}) was deleted.`, 'deleted')

            return res.json({ message: 'Category deleted successfully', data: deletedCategory });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Failed to delete category: ' + error.message });
        }
    },
};

module.exports = categories;
