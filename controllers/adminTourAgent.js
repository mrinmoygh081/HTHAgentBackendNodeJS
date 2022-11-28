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

exports.addTourAgent = async (req, res, next) => {
    try{
        const {name, email, companyName, password, phone, address, passwordConfirm, companyLogo} = req.body;
        if(!name || !email || !companyName || !password || !phone || !address) return response(400, 0, 'name, email, companyName, password, phone, address, passwordConfirm, companyLogo fields are required', res);
        const role = agent;
        activeStatus = 1;

        const addData = await User.create({
            name: name,
            email: email,
            phone:phone,
            password:password,
            passwordConfirm: passwordConfirm
        });

        const filename = `/upload/${new Date().getTime()}.jpg`
        if(!addData) return response(400,0, 'Data not uploaded', res);
        const agentInfoUpload = await TourAgent.create({
            name:name,
            companyName: filename,
            companyLogo: companyLogo,
            address: address
        });
        if(!agentInfoUpload) return response(400, 0, 'Agent info not uploaded', res);

        let data = `Thank you. 
        Your are successfully register.<br>
        your loging is given bllow.
        loginId = ${phone}
        Password = ${password}
        `

        let options = {
            email: email,
            subject: 'Resistration Confirmation',
            message: data
        };
        const sendmail = await sendEmail(options);
        return response(201, 1, {msg: 'Agent info upload successfully',data: agentInfoUpload, image:new Date().getTime(), type: 'jpg,png'}, res);

    }catch(err){
        console.log(err);
        return response(404, 0, err.message, res);
    }
};



exports.editAgentInfo = async (req, res, next) => {
    try{
        const {name, email, companyName, phone, address,  companyLogo} = req.body;
        if(!name || !email || !companyName ||  !phone || !paddress) return response(400, 0, 'name, email, companyName, phone, address, companyLogo fields are required', res); 
        
    }catch(err){
        console.log(err);
        return response(400, 0, err, res);
    }
}