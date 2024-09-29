require('dotenv').config();
const productModel = require("../models/product");
const categoryModel = require("../models/category");
const { ObjectId } = require('mongoose').Types;
const historyController = require("../controllers/history");

// Initialize the order counter from the environment variable
let orderCounter = process.env.PRODUCT_COUNTER ? parseInt(process.env.PRODUCT_COUNTER) : 1;

const generateProductId = () => {
    const orderId = `PI-${orderCounter++}`;

    // Update the environment variable in the process
    process.env.PRODUCT_COUNTER = orderCounter;

    // You can optionally write the new counter value back to the .env file
    require('fs').writeFileSync('.env', `PRODUCT_COUNTER=${orderCounter}`);

    return orderId;
};

const orders = {
    store: async (req, res, next) => {

        try {
            let { name, qty, price, description, category_id, taxes } = req.body;

            taxes = taxes ? taxes : [];

            const unique_id = generateProductId();

            if(category_id){
            // Convert category_id to MongoDB ObjectId
            category_id = ObjectId(category_id);
            }

            const newProduct = new productModel({ unique_id, name, qty, price, description, category_id, taxes });

            await newProduct.save();

            await historyController.history(req, "Product", `New product - ${unique_id} was created.`, 'added')

            return res.json({ message: 'Product created successful', data: newProduct });
        } catch (error) {
            console.log("Product Error : ",error);
            return res.status(500).json({ error: 'Registration failed: ' + error.message });
        }
    },

    // getRecentOrders: async (req, res, next) => {
    //     try {
    //         const recentOrders = await order.find({ is_deleted: false })
    //             .sort({ createdOn: -1 }) // Sorting in descending order based on createdAt timestamp
    //             .limit(5); // Limiting to the most recent 5 orders

    //         if (!recentOrders || recentOrders.length === 0) {
    //             return res.status(404).json({ error: 'No recent orders found' });
    //         }

    //         return res.json({ message: 'Recent orders fetched successfully', data: recentOrders });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ error: 'Fetch failed: ' + error.message });
    //     }
    // },

    // getOrderByStatus: async (req, res, next) => {
    //     const { status } = req.params;

    //     try {
    //         const ordersByStatus = await order.find({ status: status, is_deleted: false }).sort({ createdOn: -1 });

    //         if (!ordersByStatus || ordersByStatus.length === 0) {
    //             return res.status(404).json({ error: `No orders found with status: ${status}` });
    //         }

    //         return res.json({ message: 'Orders fetched successfully', data: ordersByStatus });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ error: 'Fetch failed: ' + error.message });
    //     }
    // },

    // listingProducts: async (req, res, next) => {
    //     try {
    //         const Products = await productModel.find({ is_deleted: false }).sort({ createdOn: -1 }).exec();;

    //         if(Products && Products.length){

    //             if (Products && Products.length) {
    //                 // Use Promise.all to fetch category names for all Products concurrently
    //                 const productPromises = Products.map(async (product) => {
    //                     const categoryData = await categoryModel.findOne({ _id: product.category_id }).exec();
    //                     console.log("categoryData : ",categoryData)
    //                     product.categoryName = categoryData.name ; // Handle cases where category might not be found
    //                     console.log("product : ",product)
    //                     return product;
    //                 });
    //                 // Wait for all promises to resolve
    //                 const productsWithCategoryNames = await Promise.all(productPromises);
    //     console.log("productsWithCategoryNames : ",productsWithCategoryNames)
    //                 return res.json({ message: 'Products fetched successfully', data: productsWithCategoryNames });
    //             }
    //         }

    //          // If no products found
    //     return res.json({ message: 'No products found', data: [] });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ error: 'Fetch failed: ' + error.message });
    //     }
    // },

    listingProducts: async (req, res, next) => {
        try {
            // Fetch products that are not deleted and sort them by creation date in descending order
            const products = await productModel.find({ is_deleted: false }).sort({ createdOn: -1 }).exec();
    
            if (products && products.length) {
                // Use Promise.all to fetch category names for all products concurrently
                const productPromises = products.map(async (product) => {
                    try {
                        // Fetch the category data using the product's category_id
                        const categoryData = await categoryModel.findOne({ _id: product.category_id }).exec();
        
                        // Create a new object that includes the categoryName
                        const productWithCategoryName = {
                            ...product.toObject(), // Convert Mongoose document to a plain object
                            categoryName: categoryData ? categoryData.name : ''
                        };
    
                        // Return the product with the new categoryName field
                        return productWithCategoryName;
                    } catch (error) {
                        console.error('Error fetching category:', error);
                        // Return product without categoryName in case of an error
                        return {
                            ...product.toObject(),
                            categoryName: 'Unknown'
                        };
                    }
                });
    
                // Wait for all promises to resolve
                const productsWithCategoryNames = await Promise.all(productPromises);
    
                // Send response with products including categoryName
                return res.json({ message: 'Products fetched successfully', data: productsWithCategoryNames });
            }
    
            // If no products found
            return res.json({ message: 'No products found', data: [] });
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Fetch failed: ' + error.message });
        }
    },    

    update: async (req, res, next) => {
        const productId = req.params.product_id;

        // Validate orderId
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        let { name, qty, price, description, category_id, taxes } = req.body;

        taxes = taxes ? taxes : []

        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                {
                    name, qty, price, description, category_id, taxes
                },
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }

            await historyController.history(req, "Product", `A product - ${updatedProduct.unique_id} was updated.`, 'updated')

            return res.json({ message: 'Product updated successfully', data: updatedProduct });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Update failed: ' + error.message });
        }
    },

    delete: async (req, res, next) => {

        const productId = req.params.product_id; // assuming order ID is passed in the URL params

        try {
            const deletedProduct = await productModel.findById(productId);

            deletedProduct.is_deleted = true;
            deletedProduct.save();

            if (!deletedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }

            await historyController.history(req, "Product", `A product - ${deletedProduct.unique_id} was deleted.`, 'deleted')

            return res.json({ message: 'Product deleted successfully', data: deletedProduct });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Deletion failed: ' + error.message });
        }
    },

}

module.exports = orders;