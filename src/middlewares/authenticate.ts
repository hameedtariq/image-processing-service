import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/authenticated-request';

export default function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({
      data: {},
      error: 'Unauthorized',
      message: '',
    });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = payload as { userId: number; username: string };
    next();
  } catch (error) {
    console.error('JWT verification failed:', error); // Log error details
    res.status(401).json({
      data: {},
      error: 'Unauthorized',
      message: '',
    });
  }
}
