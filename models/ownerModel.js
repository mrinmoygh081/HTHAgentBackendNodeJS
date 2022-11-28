const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");

const CarOwnerSchema = new mongoose.Schema({

    ownerName: {
        type: String,
        required: [true, 'Please enter owner name'],
    },
    ownerAddress: {
        type: String,
        required: [true, 'Please enter owner address']
    },
    ownerMobile: {
        type: Number,
        required: [true, 'Please enter owner mobile number']
    },
    ownerAltNumber: {
        type: Number
    },
});

const CarOwner = mongoose.model('CarOwner', CarOwnerSchema);
module.exports = CarOwner;