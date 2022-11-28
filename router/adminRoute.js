const express = require('express');
const bodyParser = require("body-parser");
const authController = require('../controllers/authController');
const carController = require('../controllers/carController');
const adminTourAgentController = require('../controllers/adminTourAgent');
const adminDriverController = require("../controllers/adminDriverControler");
const router = express.Router();
const multer = require("multer");
const path = require('path');
const { route } = require("express/lib/application");
// let urlencode = bodyParser.urlencoded({ extended: false });

const imageStorage = multer.diskStorage({
    // Destination to store image     
    Destination: 'upload', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    // limits: {
    //   fileSize: 1000000 // 1000000 Bytes = 1 MB
    // },
  //   fileFilter(req, file, cb) {
  //     // if (!file.originalname.match(/\.(pdf)$/)) { 
  //     //    // upload only png and jpg format
  //     //    return cb(new Error('Please upload a PDF'))
  //     //  }
  //    cb(undefined, true)
  // }
});

const uploadFile = multer({
  dest:'upload',
  limits:{
    fileSize: 1000000
  },
  fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(doc|docs|pdf)$/)){
      return cb(new Error ('Please upload a pdf file'));
    }
    // cb(new Error('File must be a PDF.'));
     cb(undefined, true)

  }
});



router.get("/get-all-car", authController.adminProtected, carController.getAllCar);

router.get("/get-car/:id", authController.adminProtected, carController.getCar);

router.post("/add-car-details", authController.adminProtected, carController.addCarDetails);

router.post("/add-place-price", authController.adminProtected, carController.addPlacePrice);

router.post("/update-place-price/:id", authController.adminProtected, carController.updatePlacePrice);

router.post("/add-car-includes", authController.adminProtected, carController.includes);

router.get("/booking", authController.adminProtected, carController.getAllBooking);

router.get("/booking/:id", authController.adminProtected, carController.getBooking);

// router.post("/addDriver", authController.adminProtected, carController.addDriver);

router.post("/assignDriver", authController.adminProtected, carController.assignDriver);

router.get("/getBookingInfo:pnrno", authController.adminProtected, carController.getBookingInfo);

router.post("/addTourAgent", authController.adminProtected, adminTourAgentController.addTourAgent);

router.get("/carlist",  authController.adminProtected, carController.getAllCarList);

router.get("/driverDetails",   adminDriverController.DriverDetails);


router.post('/image/:name/:ex', uploadFile.single('image'), (req, res) => {
  
  res.send(req.params.name);
}, (err, req, res, next)=>{
  res.status(400).send({status: 0, error: err.message})
});



module.exports = router;