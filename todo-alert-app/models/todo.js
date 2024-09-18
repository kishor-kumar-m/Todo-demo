const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
    },
    completed: {
        type: Boolean,
        default: false
    },
    imageUrl: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);
