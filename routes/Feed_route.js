import { Router } from "express";
import verifyUser from "../middleware/Verify.js";
import { Feedback } from "../controllers/Feed_Controller.js";


const router = Router();
router.post('/feedback', verifyUser, Feedback);

export default router;