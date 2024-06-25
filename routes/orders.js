const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('products.productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new order
router.post('/', async (req, res) => {
    const { customerName, companyName, phoneNumber, products } = req.body;

    try {
        // Check if all products in the order exist in the database
        const productIds = products.map(item => item.productId);
        const existingProducts = await Product.find({ _id: { $in: productIds } });

        if (existingProducts.length !== products.length) {
            return res.status(400).json({ message: 'Some products do not exist in the database' });
        }

        const order = new Order({
            customerName,
            companyName,
            phoneNumber,
            products: products.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }))
        });

        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
