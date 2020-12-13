const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const prodSchema = new Schema({
    sku: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    precio_efectivo: {
        type: Number,
        required: true
    },
    precio_normal: {
        type: Number,
        required: true
    },
    precio_referencial: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Producto', prodSchema);