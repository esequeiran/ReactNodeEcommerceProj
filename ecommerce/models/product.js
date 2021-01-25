const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema

const productSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlenght: 32
    },
    description: {
        type: String,
        required: true,
        maxlenght: 2000
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlenght: 32
    },
    //reference to the category model with the object id of the mongooseSchema
    category: {
        type: ObjectId,      
        ref: 'Category',
        required: true
    },
    quantity:{
        type: Number
    },
    sold:{
        type: Number,
        default: 0
    },
    //binary type of data
    photo:{
        data: Buffer,
        contentType: String
    },
    shipping:{
        required: false,
        type: Boolean
    }

}, {timestamps: true})

module.exports = mongoose.model("Product", productSchema);