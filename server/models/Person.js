const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: '',
    },
    purpose: {
        type: String,
        required: true,
        enum: ['Marriage', 'House Construction', 'Loan', 'Workers', 'Function', 'Medical', 'Others'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Person', personSchema);
