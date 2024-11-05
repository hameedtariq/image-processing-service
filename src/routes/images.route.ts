import { Router } from 'express';
import authenticate from '../middlewares/authenticate';
import upload from '../middlewares/multer';
import { getImages, saveImage } from '../controllers/images.controller';

const router = Router();

router.use(authenticate);

router.post('/', upload.single('image'), saveImage).get('/', getImages);

export default router;
