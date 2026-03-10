const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: Number,
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    items: [itemSchema]
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
