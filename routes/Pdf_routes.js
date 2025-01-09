import { Router } from "express";
import multer from "multer";
import { uploadFile, downloadFile, likeFile,  allFile} from "../controllers/Pdf_controllers.js";
import VerifyUser from '../middleware/Verify.js';


const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', VerifyUser, upload.single('pdf'), uploadFile);
router.get('/download', VerifyUser, downloadFile);
router.post('/like/:id',VerifyUser, likeFile);
router.get('/all_files', allFile);

export default router;
