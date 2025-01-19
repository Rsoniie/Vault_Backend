import { Router } from "express";
import multer from "multer";
import { uploadFile, downloadFile, likeFile,  allFile, Search_by_sub} from "../controllers/Pdf_controllers.js";
import VerifyUser from '../middleware/Verify.js';


const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', VerifyUser, upload.single('pdf'), uploadFile);
router.get('/download', VerifyUser, downloadFile);
router.post('/like/:id',VerifyUser, likeFile);
router.get('/all_files',VerifyUser, allFile);
router.get('/by_sub/:subject', Search_by_sub);

export default router;
