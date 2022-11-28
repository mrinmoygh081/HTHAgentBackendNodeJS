const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const Driver = require('./driverModel');
const Owner = require('./ownerModel');

const CarDocumentsSchema = new mongoose.Schema({
    documentTypeName: [{
        type: String,
        required: [true, 'Please enter your document types']
    }],
    documentFile: {
        type: String,
        required: [true, 'Please upload document']
    },
    created_at: {
        type: Date
    }
});

const CarDocument = mongoose.model('CarDocument', CarDocumentsSchema);
module.exports = CarDocument;