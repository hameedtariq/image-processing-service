import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  BeforeRemove,
} from 'typeorm';
import { User } from './user.entity';
import fs from 'fs/promises';
import path from 'path';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  mimeType: string;

  @Column()
  path: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.images, { onDelete: 'CASCADE' })
  user: User;

  @BeforeRemove()
  async removeFile(): Promise<void> {
    try {
      const filePath = path.resolve(__dirname, '..', this.path);
      await fs.unlink(filePath);
    } catch (error) {
      console.error(error);
    }
  }
}
