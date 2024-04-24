const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
   
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    ISBN: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true
    },
    
    publicationYear: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('book', bookSchema)