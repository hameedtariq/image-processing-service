import { Router } from 'express';
import authenticate from '../middlewares/authenticate';

const router = Router();

router.use(authenticate);

router.post('/process', (req, res) => {
  res.json({
    data: {
      message: 'Processing image',
    },
    error: '',
    message: '',
  });
});

export default router;
