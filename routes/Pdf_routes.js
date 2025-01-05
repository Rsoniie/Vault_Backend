import { Router } from "express";
import multer from "multer";
import { uploadFile, downloadFile } from "../controllers/pdf_controllers.js";
import VerifyUser from '../middleware/Verify.js';


const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', VerifyUser, upload.single('pdf'), uploadFile);
router.get('/download', VerifyUser, downloadFile);

export default router;
