import RouteType from '../types/route.type';
import authRouter from './auth.route';
import imageProcessingRouter from './images.route';

const routes: RouteType[] = [
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/images',
    router: imageProcessingRouter,
  },
];

export default routes;
