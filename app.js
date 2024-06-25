const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/inventory', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false // DeprecationWarning'i önlemek için gerekli
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');

app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);

// Server Start
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
