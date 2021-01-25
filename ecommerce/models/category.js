const mongoose = require('mongoose');

const categoryScema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        maxlenght: 32
    }   
}, {timestamps: true})

module.exports = mongoose.model("Category", categoryScema);