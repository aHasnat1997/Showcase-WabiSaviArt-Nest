import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../../services/prisma.service.js';
import { EmailService } from '../../services/email.service.js';
import { ReportController } from './report.controller.js';
import { ReportService } from './report.service.js';

@Module({
  imports: [ConfigModule],
  controllers: [ReportController],
  providers: [ReportService, PrismaService, EmailService],
})
export class ReportModule {}
