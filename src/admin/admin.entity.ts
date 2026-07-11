import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
@Entity('admin')
export class AdminEntity {
  @PrimaryColumn()
  adminId: string;

  @Column({ type: 'varchar', nullable: true })
  fullname: string | null;

  @Column()
  email: string;

  @Column()
  nid: string;

  @Column({
    type: 'bigint',
    unsigned: true,
  })
  phone: number;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  profilePic: string;

  @BeforeInsert()
  generateId() {
    const timerand = String(Date.now()).slice(-4);
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(2, 4);
    const rand = String(Math.floor(10 + Math.random() * 90));

    this.adminId = `${timerand}-${day}${month}${year}-${rand}`;
  }
}
