// src/aibot/aibot.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AibotController } from './aibot.controller';
import { AibotService } from './aibot.service';
import { ChatMessageEntity } from './aibot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessageEntity]), JwtModule],
  controllers: [AibotController],
  providers: [AibotService],
})
export class AibotModule {}
