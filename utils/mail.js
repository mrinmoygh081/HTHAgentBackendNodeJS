const { acceptsLanguages } = require("express/lib/request");
const nodemailer = require("nodemailer");

const sendEmail = async(options) => {

    const mailTransport = nodemailer.createTransport({
        host: "webextremesinternational.com",
        secure: true,
        secureConnection: true, // TLS requires secureConnection to be false
        port: 465,
        debug: true,
        auth: {

            user: "testing@webextremesinternational.com",
            pass: "testing@123",
        }
    });



    const transpoter = nodemailer.createTransport({
        host: "mail.hthrooms.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "cabs@hthrooms.com",
            pass: "HTH@cabs@123",
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    // 2) define email options
    console.log(options.email, options.subject, options.message);
    const mailOptions = {
        from: "HthCabs <support@hthtours.com>",
        to: options.email,
        subject: options.subject,
        html: `Dear Customer,<br>
        Your booking is confirmed<br>
        Please <b><a href="http://159.223.97.124:4000/api/v1/agent/qrCode/${options.message}">click here</a></b> open your vehicle verification QR code. You need to scan before trip start with driver for verify your trip. After verification your trip will be start. Wish you a happy journey. 
        
        <br><br>Regards 
        <br>Customer support team`,


    };
    // 3)actually send email
    mailTransport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
};

module.exports = sendEmail;