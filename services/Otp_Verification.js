import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { timeStamp } from 'console';


let otpStore = {};
const generateOTP = async(email) => {

    try
    {
        //  console.log("Email from generate OTP", email);
         const otp = crypto.randomInt(1000000, 9999999);
         otpStore[email] = {otp, timeStamp : Date.now()};


    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'roshansonivslasthope@gmail.com',  // Replace with your email
            pass: process.env.APP_PASSWORD
            // pass: process.env.EMAIL_PASSWORD    // Replace with your email password or use environment variables
               
        }
    });

    const mailOptions = {
        from: 'roshansonivslasthope@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Just one step lefy  here is your OTP : ${otp}`,
    };

    // Send the OTP to the provided email address
    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully');
    return { success: true, message: 'OTP sent to email.', otp: otp};
} catch (err) {
    console.error('Error sending OTP:', err);
    return { success: false, message: 'Error sending OTP.' };
}


}


const verifyOTP = async (email, otp) => {
    try {
        const storedOtpData = otpStore[email];

        if (!storedOtpData) {
            return { success: false, message: 'OTP not found or expired.' };
        }

        const otpAge = Date.now() - storedOtpData.timestamp;
        if (otpAge > 5 * 60 * 1000) { 
            delete otpStore[email];
            return { success: false, message: 'OTP has expired.' };
        }

        if (parseInt(otp) === storedOtpData.otp) {

            delete otpStore[email];
            return { success: true, message: 'OTP verified successfully.' };
        } else {
            return { success: false, message: 'Invalid OTP.' };
        }
    } catch (err) {
        console.error('Error verifying OTP:', err);
        return { success: false, message: 'Error verifying OTP.' };
    }
};


export {generateOTP, verifyOTP};