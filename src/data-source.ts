import { DataSource } from 'typeorm';
import config from './config/database';

export const AppDataSource = new DataSource(config);
