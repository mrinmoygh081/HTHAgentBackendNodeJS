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
const adminPriceController = require("../controllers/adminPriceController")
const adminBookingController = require("../controllers/adminBookingController");
// let urlencode = bodyParser.urlencoded({ extended: false });

const imageStorage = multer.diskStorage({
    // Destination to store image     
    Destination: function(req, file, cb){
      cb(null, "upload");
    }, 
      filename: (req, file, cb) => {
        const parts = file.mimetype.split("/");
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
   
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

router.get("/get-place-price", authController.adminProtected, adminPriceController.allPlacePrice);

router.post("/update-place-price/:id", authController.adminProtected, carController.updatePlacePrice);

router.post("/add-car-includes", authController.adminProtected, carController.includes);

router.get("/booking", authController.adminProtected, adminBookingController.getAllBooking);

router.post("/booking", authController.adminProtected, adminBookingController.booking);

router.get("/booking/:id", authController.adminProtected, carController.getBooking);
router.post("/booking/:id", authController.adminProtected, adminBookingController.editBooking);

// router.post("/addDriver", authController.adminProtected, carController.addDriver);

router.post("/assignDriver", authController.adminProtected, carController.assignDriver);

router.get("/getBookingInfo:pnrno", authController.adminProtected, carController.getBookingInfo);

router.get("/booking", authController.adminProtected, adminBookingController.getAllBooking);

router.post("/addTourAgent", authController.adminProtected, adminTourAgentController.addTourAgent);

router.get("/carlist",  authController.adminProtected, carController.getAllCarList);

router.get("/driverDetails",   adminDriverController.DriverDetails);


router.post('/image/:name/:ex', async (req, res, next)=>{
  var storage = multer.diskStorage({
    destination: function(req, file, cb){
      console,log(__dirname)
      cb(null, '__dirname/upload');
    },
    filename: function(req, file, cb){
      var temp_file_arr = file.originalname.split(".");

      var temp_file_name = temp_file_arr[0];
      var temp_file_ex = temp_file_arr[1];
      if(temp_file_ex != req.params.ex) return res.send('this file not supported');
      cb(null, temp_file_name + '-' + Date.now() + '.' +temp_file_ex);

    }
  });

  let upload = multer({storage: storage}).single('image');

  upload(req, res, function(err){
    if(err){
      return res.send("Error upload file");
    }else{
      return res.end(`/upload/${req.params.name}${Date.now()}.${req.params.ex}`);
    }
  })

});



module.exports = router;