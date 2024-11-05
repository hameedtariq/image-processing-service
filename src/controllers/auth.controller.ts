import { User } from '../entities/user.entity';
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiResponseType from '../types/api-response.type';

export const registerUser = async (
  req: Request,
  res: Response<ApiResponseType<{ token: string }>>
) => {
  const { username, email, password } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const user = new User();
  user.username = username;
  user.email = email;
  user.password = await bcryptjs.hash(password, 10);
  await userRepository.save(user);

  const token = jwt.sign({ userId: user.id }, 'mysecretkey', {
    expiresIn: '1h',
  });

  const apiResponse = {
    data: { token },
    error: '',
    message: 'User registered successfully',
  };

  res.json(apiResponse);
};

export const loginUser = async (
  req: Request,
  res: Response<ApiResponseType<{ token: string }>>
) => {
  const { email, password } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ email });

  if (!user) {
    const apiResponse = {
      data: { token: '' },
      error: 'User not found',
      message: '',
    };
    res.status(404).json(apiResponse);
    return;
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    const apiResponse = {
      data: { token: '' },
      error: 'Invalid password',
      message: '',
    };
    res.status(401).json(apiResponse);
    return;
  }

  const token = jwt.sign({ userId: user.id }, 'mysecretkey', {
    expiresIn: '1h',
  });

  const apiResponse = {
    data: { token },
    error: '',
    message: 'User logged in successfully',
  };

  res.json(apiResponse);
};
