import express from 'express'
import { Create_User, Login_User } from '../controllers/user_controllers.js'
import { Router } from 'express'
import multer from 'multer';

const router = Router();
router.route('/createuser').post(Create_User);
router.route('/loginuser').post(Login_User);


export default router;


