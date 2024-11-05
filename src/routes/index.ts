import RouteType from '../types/route.type';
import authRouter from './auth.route';
import imageProcessingRouter from './image-processing.route';

const routes: RouteType[] = [
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/image-processing',
    router: imageProcessingRouter,
  },
];

export default routes;
