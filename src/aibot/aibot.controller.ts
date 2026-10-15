import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AibotService } from './aibot.service';
import { AdminAuthGuard } from 'src/admin/adminAuth/adminAuth.guard';
import { AdminEntity } from 'src/admin/admin.entity';

@Controller('aibot')
@UseGuards(AdminAuthGuard)
export class AibotController {
  constructor(private readonly aibotService: AibotService) {}

  @Post('ask')
  @HttpCode(HttpStatus.OK)
  async getChatResponse(@Body() body: { userId: string; prompt: string }) {
    const result = await this.aibotService.getChatResponse(
      body.userId,
      body.prompt,
    );

    return {
      success: true,
      data: result.text,
    };
  }

  @Get('history/:userId')
  async getChatHistory(@Param('userId') userId: string) {
    const history = await this.aibotService.getUserChatHistory(userId);

    return {
      success: true,
      data: history,
    };
  }

  @Get('getAdminByChatId/:chatId')
  async getAdminByChatId(
    @Param('chatId') chatId: string,
  ): Promise<AdminEntity> {
    return await this.aibotService.getAdminByChatId(chatId);
  }
}
