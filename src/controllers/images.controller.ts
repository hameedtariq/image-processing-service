import { AppDataSource } from '../data-source';
import { Image } from '../entities/image.entity';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { User } from '../entities/user.entity';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export const saveImage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const imageFile = req.file;
  if (!imageFile) {
    const apiResponse = {
      data: {},
      error: 'Please provide an image',
      message: '',
    };
    res.status(400).json(apiResponse);
    return;
  }
  const imageRepository = AppDataSource.getRepository(Image);
  const image = new Image();
  image.fileName = imageFile.filename;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id: req.user?.userId });
  if (!user) {
    const apiResponse = {
      data: {},
      error: 'User not found',
      message: '',
    };
    res.status(404).json(apiResponse);
    return;
  }
  image.user = user;
  image.mimeType = imageFile.mimetype;
  image.path = imageFile.path;
  await imageRepository.save(image);

  const apiResponse = {
    data: { image },
    error: '',
    message: 'Image saved successfully',
  };

  res.json(apiResponse);
};

export const getImages = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const imageRepository = AppDataSource.getRepository(Image);
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id: req.user?.userId });
  if (!user) {
    const apiResponse = {
      data: {},
      error: 'User not found',
      message: '',
    };
    res.status(404).json(apiResponse);
    return;
  }
  const images = await imageRepository.findBy({ user });

  const apiResponse = {
    data: { images },
    error: '',
    message: '',
  };

  res.json(apiResponse);
};

export const transformImage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const imageId = parseInt(req.params.id, 10);
  const imageRepository = AppDataSource.getRepository(Image);
  const image = await imageRepository.findOneBy({ id: imageId });
  if (!image) {
    const apiResponse = {
      data: {},
      error: 'Image not found',
      message: '',
    };
    res.status(404).json(apiResponse);
    return;
  }
  // Transform image here
  const transformations = req.body.transformations;
  const imageBuffer = sharp(image.path);

  if (!transformations) {
    const apiResponse = {
      data: {},
      error: 'Please provide transformations',
      message: '',
    };
    res.status(400).json(apiResponse);
    return;
  }

  if (transformations.resize) {
    const { width, height } = transformations.resize;
    imageBuffer.resize(width, height);
  }

  if (transformations.crop) {
    const { width, height, x, y } = transformations.crop;
    imageBuffer.extract({ width, height, left: x, top: y });
  }

  if (transformations.rotate) {
    imageBuffer.rotate(transformations.rotate);
  }

  if (transformations.filters?.grayscale) {
    imageBuffer.grayscale();
  }

  if (transformations.filters?.sepia) {
    imageBuffer.tint('rgb(112, 66, 20)');
  }

  if (transformations.filters?.blur) {
    imageBuffer.blur();
  }

  if (transformations.filters?.sharpen) {
    imageBuffer.sharpen();
  }

  // process the transformations
  const buffer = await imageBuffer.toBuffer();

  // save the transformed image
  await fs.writeFile(image.path, buffer); // save the transformed image to the file system

  console.log('Transformations:', transformations);
  const apiResponse = {
    data: { image },
    error: '',
    message: 'Image transformed successfully',
  };

  res.json(apiResponse);
};
