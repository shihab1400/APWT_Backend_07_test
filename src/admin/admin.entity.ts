import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('admin')
export class AdminEntity {
  @PrimaryGeneratedColumn()
  adminId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  nid: string;

  @Column()
  profilePic: string;
}
