import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../../src/services/prisma.service.js';
import { EmailService } from '../../../src/services/email.service.js';
import { SupportController } from './support.controller.js';
import { SupportService } from './support.service.js';

@Module({
  imports: [ConfigModule],
  controllers: [SupportController],
  providers: [SupportService, PrismaService, EmailService],
})
export class SupportModule {}
