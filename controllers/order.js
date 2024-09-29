require('dotenv').config();
const order = require("../models/order");
const { ObjectId } = require('mongoose').Types;
const historyController = require("../controllers/history");

// Initialize the order counter from the environment variable
let orderCounter = process.env.ORDER_COUNTER ? parseInt(process.env.ORDER_COUNTER) : 1;

const generateOrderId = () => {
    const orderId = `Order No ${orderCounter++}`;
    
    // Update the environment variable in the process
    process.env.ORDER_COUNTER = orderCounter;
    
    // You can optionally write the new counter value back to the .env file
    require('fs').writeFileSync('.env', `ORDER_COUNTER=${orderCounter}`);
    
    return orderId;
};

const orders = {
    store: async (req, res, next) => {

        const { gstNoSupplier, idMarks, description, quantity, cgstAmount, rofCgst,
            sgstAmount, rofSgst, igstAmount, rofIgst, trafficClassification,
            order_date, natureOfProcessing, address, duration } = req.body;

            calCgst = cgstAmount + (cgstAmount * (rofCgst/100));
            calSgst = sgstAmount + (sgstAmount * (rofSgst/100));
            calIgst = igstAmount + (igstAmount * (rofIgst/100));

            let status = 'Pending';
            const order_no = generateOrderId();

        try {
            const newOrder = new order({ order_no, gstNoSupplier, idMarks, description, quantity, cgstAmount, rofCgst, calCgst,
                sgstAmount, rofCgst, rofSgst, calSgst, igstAmount, rofIgst, calIgst, trafficClassification,
                order_date, natureOfProcessing, address, duration, status });

            await newOrder.save();

            await historyController.history(req, "Sales Order", `New sales order - ${order_no} was created.`, 'added')

            return res.json({ message: 'Order created successful', data: newOrder });
        } catch (error) {
            // console.log(error);
            return res.status(500).json({ error: 'Registration failed: ' + error.message });
        }
    },

    getRecentOrders: async (req, res, next) => {
        try {
            const recentOrders = await order.find({ is_deleted: false })
                .sort({ createdOn: -1 }) // Sorting in descending order based on createdAt timestamp
                .limit(5); // Limiting to the most recent 5 orders

                if (!recentOrders || recentOrders.length === 0) {
                return res.status(404).json({ error: 'No recent orders found' });
            }
    
            return res.json({ message: 'Recent orders fetched successfully', data: recentOrders });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Fetch failed: ' + error.message });
        }
    },
    
    getOrderByStatus: async (req, res, next) => {
        const { status } = req.params;

        try {
          const ordersByStatus = await order.find({ status: status, is_deleted: false  }).sort({ createdOn: -1 });
      
          if (!ordersByStatus || ordersByStatus.length === 0) {
            return res.status(404).json({ error: `No orders found with status: ${status}` });
          }
      
          return res.json({ message: 'Orders fetched successfully', data: ordersByStatus });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ error: 'Fetch failed: ' + error.message });
        }
      },

    listingOrders: async (req, res, next) => {
        try {
            const orders = await order.find({ is_deleted: false }).sort({ createdOn: -1 }).exec();;

            return res.json({ message: 'Orders fetched successfully', data: orders });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Fetch failed: ' + error.message });
        }
    },

    update: async (req, res, next) => {
        const orderId = req.params.order_id;
    
        // Validate orderId
        if (!ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }
    
        const {
            gstNoSupplier, idMarks, description, quantity, cgstAmount, rofCgst, calCgst,
            sgstAmount, rofSgst, calSgst, igstAmount, rofIgst, calIgst, trafficClassification,
            order_date, natureOfProcessing, address, duration, status
        } = req.body;
    
        try {
            const updatedOrder = await order.findByIdAndUpdate(
                orderId,
                {
                    gstNoSupplier, idMarks, description, quantity, cgstAmount, rofCgst, calCgst,
                    sgstAmount, rofSgst, calSgst, igstAmount, rofIgst, calIgst, trafficClassification,
                    order_date, natureOfProcessing, address, duration, status
                },
                { new: true }
            );
    
            if (!updatedOrder) {
                return res.status(404).json({ error: 'Order not found' });
            }
    
            await historyController.history(req, "Sales Order", `A sales order - ${updatedOrder.order_no} was updated.`, 'updated')

            return res.json({ message: 'Order updated successfully', data: updatedOrder });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Update failed: ' + error.message });
        }
    },

    delete: async (req, res, next) => {

        const orderId = req.params.order_id; // assuming order ID is passed in the URL params

        try {
            const deletedOrder = await order.findById(orderId);

            deletedOrder.is_deleted = true;
            deletedOrder.save();

            if (!deletedOrder) {
                return res.status(404).json({ error: 'Order not found' });
            }

            await historyController.history(req, "Sales Order", `A sales order - ${deletedOrder.order_no} was deleted.`, 'deleted')

            return res.json({ message: 'Order deleted successfully', data: deletedOrder });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Deletion failed: ' + error.message });
        }
    },

    getAllOrderCount: async (req, res, next) => {
        try {
            let allOrderCount = await order.find({ is_deleted: false }).count();
    
            return res.json({ message: 'All order count fetched successfully', data: allOrderCount });
        } catch (error) {
            return res.status(500).json({ error: 'Fetch failed: ' + error.message });
        }
    },

    getPendingOrderCount: async (req, res, next) => {
        try {
            let pendingOrderCount = await order.find({ status: "Pending", is_deleted: false }).count();

            return res.json({ message: 'Pending order count fetched successfully', data: pendingOrderCount });
        } catch (error) {
            return res.status(500).json({ error: 'Fetch failed: ' + error.message });
        }
    },

    getInProgressOrderCount: async (req, res, next) => {
        try {
            let inProgressOrderCount = await order.find({ status: "In Progress", is_deleted: false }).count();

            return res.json({ message: 'In Progress order count fetched successfully', data: inProgressOrderCount });
        } catch (error) {
            return res.status(500).json({ error: 'Fetch failed: ' + error.message });
        }
    },

    getDeliveredOrderCount: async (req, res, next) => {
        try {
            let deliveredOrderCount = await order.find({ status: "Delivered", is_deleted: false }).count();

            return res.json({ message: 'Delivered order count fetched successfully', data: deliveredOrderCount });
        } catch (error) {
            return res.status(500).json({ error: 'Fetch failed: ' + error.message });
        }
    },

    getCancelledOrderCount: async (req, res, next) => {
        try {
            let cancelledOrderCount = await order.find({ status: "Cancelled", is_deleted: false }).count();

            return res.json({ message: 'Cancelled order count fetched successfully', data: cancelledOrderCount });
        } catch (error) {
            return res.status(500).json({ error: 'Fetch failed: ' + error.message });
        }
    },

}

module.exports = orders;