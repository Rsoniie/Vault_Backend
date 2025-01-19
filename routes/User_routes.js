import express from 'express'
import { Create_User, Login_User , Verify_Otp, Profile} from '../controllers/User_controllers.js'
import { Router } from 'express'
import multer from 'multer';
import verifyUser from '../middleware/Verify.js';

const router = Router();
router.route('/createuser').post(Create_User);
router.route('/loginuser').post(Login_User);
router.post('/verify', Verify_Otp);
router.get('/profile/:name', verifyUser, Profile);



export default router;


