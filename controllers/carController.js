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
const response = (status, code, msg, res) => {
    return res.status(status).json({ status: code, message: msg });
}



// -------------------ADD CAR WITH DETAILS----------------------------


exports.addCarDetails = async(req, res, next) => {
    try {
       
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
        const login = await User.create(loginInfo);

        const driverData = {
            driverName: req.body.driverName,
            driverMobile: req.body.driverMobile,
            driverAddress: req.body.driverAddress,
            driverPhoto: req.body.driverPhoto,
            userId: login.id
        };



        const ownerRegister = await CarOwner.create(ownerData);
        if (ownerRegister) {
            const driverRegister = await Driver.create(driverData);
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
                    driver: driverRegister._id,
                    owner: ownerRegister._id

                };
                const carRegister = await Car.create(carData);
                if (carRegister) {

                    const uniqueFilename = new Date().getTime();
                    const fileName = `/upload/${uniqueFilename}.pdf`

                    const carDocuments = {
                        documentTypeName: req.body.documentNames,
                        documentFile: fileName
                    };
                    const documentUpload = await carDocument.create(carDocuments);
                    if (documentUpload) {

                        const carType = await CarTypeCount.find({ carModel: req.body.carModel });
                        if (carType.length == 0) {
                            const addCarType = CarTypeCount.create({ carModel: req.body.carModel });
                            if (addCarType) {
                                 return response(201, 1, {ownerInfo: ownerData, driverInfo: driverData, ownerInfo:ownerRegister, carInfo: carRegister, carDocumentInfo: documentUpload, image:`${uniqueFilename}`, type:'pdf'}, res);
                            }
                        } else {
                            return response(201, 1, {ownerInfo: ownerData, driverInfo: driverData, ownerInfo:ownerRegister, carInfo: carRegister, carDocumentInfo: documentUpload}, res);
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


// -------------------ALL CAR DETAILS----------------------------


exports.getAllCar = async(req, res, next) => {
    // if(authUser.role == 'admin'){

    try {
        const allDriver = await Car.find().sort({ _id: -1 }).populate('driver').populate('owner');
        if (allDriver) {
            return response(200, 1, allDriver, res);
        } else {
            return response(404, 0, 'Data not found', res);
        }

    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }



    // }else{
    //     response(404, 0, 'Not authorized', res);
    // }
}

// -------------------CAR DETAILS----------------------------


exports.getCar = async(req, res, next) => {
    // if(authUser == 'admin'){
    const id = req.params.id
    try {
        const driver = await Car.findOne({ _id: id }).populate('driver').populate('owner');
        if (driver) {
            return response(200, 1, driver, res);
        } else {
            return response(404, 0, 'Data not found', res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
    // }else{
    //     return response(404, 0, 'Not authorized', res);
    // }
}


// -------------------BLOCK DRIVER----------------------------


exports.blockDriver = async(req, res, next) => {
    // if(authUser == 'admin'){
    try {
        if (req.body.block == '1' ||
            req.body.block == '0') {
            const id = req.params.id;
            const block = await Driver.updateOne({ _id: id }, { driverStatus: req.body.block });
            if (block) {
                if (req.body.block == '1') {
                    return response(200, 1, 'Driver unblock successfully', res);
                } else {
                    return response(200, 1, 'Driver block successfully', res);
                }

            }
        } else {
            return response(400, 0, 'Please choose correct value', res);
        }

    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }

    // }else{
    //     return response(404, 0, 'Not authorized', res);
    // }
}


// -------------------ADD PLACE PRICE----------------------------


exports.addPlacePrice = async(req, res, next) => {
    try {
        if (req.body.place && req.body.price && req.body.carModel) {
            const add = await PlacePrice.create({ carModel: req.body.carModel, place: req.body.place, price: req.body.price, perKmPrice: req.body.perKmPrice, createdAt: new Date() });
            if (add) {
                return response(200, 1, 'Data added successfully', res);
            } else {
                return response(400, 0, 'something error', res);
            }
        } else {
            return response(400, 0, 'Please fill all fields', res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
}


// -------------------UPDATE PLACE PRICE----------------------------


exports.updatePlacePrice = async(req, res, next) => {
    try {
        if (req.body.place && req.body.price) {
            const add = await PlacePrice.updateOne({ _id: req.params.id }, { carModel: req.body.carModel, place: req.body.place, price: req.body.price, createdAt: new Date() });
            if (add) {
                return response(200, 1, 'Data added successfully', res);
            } else {
                return response(400, 0, 'something error', res);
            }
        } else {
            return response(400, 0, 'Please fill all fields', res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
}

// -------------------ALL BOOKING LIST----------------------------


exports.getAllBooking = async(req, res, next) => {
    try {
        
        const booking = await Booking.find().sort({ _id: -1 }).populate('driver').populate('userId').populate('car'); 
        if (booking) {
            return response(200, 1, booking, res);
        } else {
            return response(400, 0, 'Booking not found', res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
}


// -------------------BOOKING DETAILS----------------------------


exports.getBooking = async(req, res, next) => {
    try {
        let booking = {};
        const bookingDetails = await Booking.findOne({ _id: req.params.id }).sort({ _id: -1 }).populate('car').populate('userId').populate('driver').sort({bookingDate:'desc'});
        const driverPayment = await DriverPayment.findOne({bookingId: bookingDetails._id})
        booking.bookingDetails = bookingDetails;
        booking.driverPayment = driverPayment;
        if (booking) {
            return response(200, 1, booking, res);
        } else {
            return response(400, 0, 'Booking not found', res);
        }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
}

exports.includes = async(req, res, next) => {
    try {
        const data = {
            carModel: req.body.carModel,
            includes: req.body.includes,
            excludes: req.body.excludes,
            passenger: req.body.passenger,
            luggage: req.body.luggage,
            created_at: new Date(),
        };

        const includes = await Includes.create(data);

        if (includes) {
            return response(200, 1, includes, res);
        } else {
            return response(400, 0, 'Data not inserted', res);
        }

    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }

}

exports.addDriver = async (req, res, next) => {
    
}


// -------------------ASSIGN DRIVEER----------------------------

exports.assignDriver = async (req, res, next) => {

    const pnrno = req.body.pnrno;
    const bookingId = req.body.bookingId;
    const carId = req.body.carId;
    const date = req.body.date;
    const amount = req.body.amount
    const totalPrice = req.body.totalPrice;
    const paymentMood = req.body.paymentMood;

    const carDetails = await Car.findOne({_id:carId}).select('driver');
    console.log(carDetails)
    if(req.body.date){
        let date = req.body.date;
    }else{
        let date = new Date();
    }
    const findBookingId = await Booking.findOne({pnrno: pnrno});

    if(findBookingId.driver != null) return response(400, 0, 'Booking already assign', res);

    console.log(findBookingId);
   
    const assignDriver = await Booking.updateOne({pnrno: pnrno}, {
        $set:{
            driver:carDetails.driver,
            car: carDetails._id
        }

    });

    console.log(assignDriver);
    
    if(!assignDriver) return response(400, 0, 'Something error', res);

   const data = {
        bookingId:bookingId,
        driverId:carDetails.driver,
        carId:carDetails._id,
        totalPrice:totalPrice,
        date:date,
        payment:[
            {
                amount: amount,
                date: new Date(),
                paymentMood: paymentMood
            }
        ]
    };


    console.log('-----------=-----------=============--------------======-------------',data);
    
    const driverPayment = await DriverPayment.create(
       {
            bookingId:findBookingId._id,
            driverId:carDetails.driver,
            carId:carDetails._id,
            totalPrice:totalPrice,
            date:date,
            payment:[
                {
                    amount: amount,
                    date: new Date(),
                    paymentMood: paymentMood
                }
            ]
        }
    );

    if(!driverPayment) return response(400, 0, 'Driver payment details not updated', res);

    return response(200, 1, driverPayment, res);
}



exports.getAllCarList = async(req, res, next) => {
    try {
        // if (req.body.date) {
        //     const date = new Date(req.body.date);
            const cars = await Car.find({
                $or: [
                    { "availability.status": "1" },
                    { "availability.status": '' },
                ],
            }).select('permit carName').populate({path:'driver', mathch:{driverStatus:1}, select:'driverName'});
            console.log(new Date(req.body.date));
            if (cars.length > 0) {
                return response(200, 1, cars, res);
            } else {
                return response(200, 1, "No car found", res);
            }
    // }
    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
};


exports.getBookingInfo = async(req, res, next) => {

    try{
        let allInfo;
        const pnrno = req.params.pnrno;
        const bookingInfo = await Booking.findOne({pnrno:pnrno}).populate('car').populate('driver').populate('userId');

        console.log(bookingInfo);

    } catch (err) {
        console.log(err);
        return response(404, 0, err.message, res);
    }
}