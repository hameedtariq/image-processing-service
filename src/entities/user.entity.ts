import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Image } from './image.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Image, (image) => image.user)
  images: Image[];

  // Method to generate JWT token
  generateJwtToken(): string {
    const payload = {
      userId: this.id,
      username: this.username,
    };

    // Replace 'your_jwt_secret' with your actual secret key
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
    return token;
  }
}
