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


exports.carDetails = async (req, res, next) => {
    try{
        const id = req.params.id;
        const carAllPaymentDetails = await DriverPayment.find({car:id}).populate('bookingId');
        if(carAllPaymentDetails.length < 1) return response(200,1, 'No record found', res);
        return response(200,1,{carAllPaymentDetails }, res);
    }catch(error){
        console.log(error);
        return response(400, 0, 'Something error', res);
    }
}

// exports.editCarDetails = async(req, res, next){

// }

exports.editCarDetails = async(req, res, next) => {
    try {

        
        const getcardata = await Car.findOne({_id: req.params.id}).select('driver owner');
      
        const driverDataFatch = await Driver.findOne({_id:getcardata.driver}).select('userId');

        const loginDataFatch = await User.findOne({email: req.body.email});

        // if (loginDataFatch) return response(200, 0, 'Email already registered', res);

        if(!getcardata) return response(200,0,'Car details not found', res);


       
        const ownerData = {
            ownerName: req.body.ownerName,
            ownerMobile: req.body.ownerMobile,
            ownerAddress: req.body.ownerAddress,
        };


        const loginInfo = {
            name: req.body.driverName,
            role: 'driver',
            phone: req.body.driverMobile,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        };
        const login = await User.updateOne({_id:driverDataFatch.userId},loginInfo);

        const driverData = {
            driverName: req.body.driverName,
            driverMobile: req.body.driverMobile,
            driverAddress: req.body.driverAddress,
            driverPhoto: req.body.driverPhoto,
        };



        const ownerRegister = await CarOwner.updateOne({_id:getcardata.owner}, {$set:ownerData});
        if (ownerRegister) {
            const driverRegister = await Driver.updateOne({_id:getcardata.driver},{$set:driverData});
            if (driverRegister) {
                const carData = {

                    carName: req.body.carName,
                    carModel: req.body.carModel,
                    registration: {
                        registrationNo: req.body.registrationNo,
                        registrationExpire: new Date(req.body.registrationExpire),
                        CarNumber: req.body.CarNumber

                    },
                    permit: req.body.permit,

                    availability: {
                        startDate: new Date(req.body.startDate),
                        endDate: new Date(req.body.endDate),

                    },
                    price: req.body.price,

                };
                const carRegister = await Car.updateOne({_id:req.params.id},{$set:carData});
                if (carRegister) {

                    const fileName = req.body.documentFile

                    const carDocuments = {
                        documentTypeName: req.body.documentNames,
                        documentFile: fileName,
                        car: req.params.id
                    };
                    const documentUpload = await carDocument.updateOne({car:req.params.id},{$set:carDocuments});
                    if (documentUpload) {

                        const carType = await CarTypeCount.find({ carModel: req.body.carModel });
                        if (carType.length == 0) {
                            const addCarType = CarTypeCount.create({ carModel: req.body.carModel });
                            if (addCarType) {
                                 return response(201, 1, 'Data upload successfully', res);
                            }
                        } else {
                            return response(201, 1, 'Data upload successfully', res);
                        }
                    }

                }
            }
        } else {
            return response(404, 0, 'Something error', res);
        }
    } catch (err) {
        console.log(err)
        return response(404, 0, err.message, res)
    }
}
