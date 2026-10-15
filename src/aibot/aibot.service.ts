/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  OnModuleInit,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleGenAI } from '@google/genai';
import { ChatMessageEntity } from './aibot.entity';
import { AdminEntity } from 'src/admin/admin.entity';

@Injectable()
export class AibotService implements OnModuleInit {
  private ai!: GoogleGenAI;

  constructor(
    private configService: ConfigService,
    @InjectRepository(ChatMessageEntity)
    private chatRepository: Repository<ChatMessageEntity>,
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is missing in environmental configuration!',
      );
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async getChatResponse(
    userId: string,
    prompt: string,
  ): Promise<{ text: string }> {
    try {
      if (!this.ai) {
        throw new Error('GoogleGenAI client is not initialized.');
      }

      const userMessage = this.chatRepository.create({
        userId,
        message: prompt,
        sender: 'user',
      });
      await this.chatRepository.save(userMessage);

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const replyText = response.text || 'No response generated.';

      const botMessage = this.chatRepository.create({
        userId,
        message: replyText,
        sender: 'bot',
      });
      await this.chatRepository.save(botMessage);

      return {
        text: replyText,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new BadRequestException(`Gemini API Error: ${errorMessage}`);
    }
  }

  async getUserChatHistory(userId: string): Promise<ChatMessageEntity[]> {
    return await this.chatRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  async getAdminByChatId(chatId: string): Promise<AdminEntity> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: { user: true },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    if (!chat.user) {
      throw new NotFoundException(
        `No admin user is associated with chat message ID ${chatId}.`,
      );
    }

    return chat?.user;
  }
}
