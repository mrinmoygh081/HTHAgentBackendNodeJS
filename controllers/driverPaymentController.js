const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require("bcrypt");
const Car = require('../models/carModel');
const AppError = require('../utils/appError');
const CarOwner = require('./../models/ownerModel');
const Driver = require('./../models/driverModel');
const carDocument = require('./../models/carDocumentModel');
const PlacePrice = require('./../models/placeModel');
const CarTypeCount = require('./../models/carTypeCount');
const Booking = require('./../models/bookingModel');
const Includes = require('./../models/includeModel');
const DriverPayment = require("../models/driverPayment");
const TourAgent = require('../models/tourAgentModel');
const sendEmail = require('../utils/mail');


const response = (status, code, msg, res) => {
    return res.status(status).json({ status: code, message: msg });
}

const between = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


exports.getAllPayments = async (req, res, next)=> {
    try{
        const id = req.params.id
        const allPayments = await DriverPayment.find({driverId:id}).sort({date:'asc'}).populate('bookingId').populate('car');
        if(!allPayments) return response(200, 0, 'Something error', res)
        if(allPayments.length < 1) return response(200, 0, 'No payment found', res)
        return response(200, 1, {allPayments}, res)
    }catch (err) {
        // console.log(err)
        response(400, 0, err, res);
    
    }
   
}