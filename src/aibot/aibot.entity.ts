import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AdminEntity } from 'src/admin/admin.entity';

@Entity('chat_messages')
export class ChatMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar' }) // 'user' or 'bot'
  sender: 'user' | 'bot';

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: string;

  @ManyToOne(() => AdminEntity, (user) => user.chatMessages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: AdminEntity;
}
