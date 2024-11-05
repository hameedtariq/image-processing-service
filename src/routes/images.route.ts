import { Router } from 'express';
import authenticate from '../middlewares/authenticate';
import upload from '../middlewares/multer';
import {
  getImages,
  saveImage,
  transformImage,
} from '../controllers/images.controller';

const router = Router();

router.use(authenticate);

router.post('/', upload.single('image'), saveImage).get('/', getImages);

router.patch('/:id/transform', transformImage);

export default router;
