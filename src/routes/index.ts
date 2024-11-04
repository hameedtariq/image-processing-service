import RouteType from '../types/route.type';
import authRouter from './auth.route';

const routes: RouteType[] = [
  {
    path: '/auth',
    router: authRouter,
  },
];

export default routes;
