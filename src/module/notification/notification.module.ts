import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { NotificationController } from './notification.controller.js';
import { SseService } from '../../services/sse.service.js';
import { PrismaService } from '../../services/prisma.service.js';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, SseService, PrismaService],
  exports: [NotificationService, SseService],
})
export class NotificationModule {}
