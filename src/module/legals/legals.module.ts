import { Module } from '@nestjs/common';
import { LegalsController } from './legals.controller.js';
import { LegalsService } from './legals.service.js';
import { PrismaService } from '../../services/prisma.service.js';
import { FaqController } from './faq.controller.js';
import { FaqService } from './faq.service.js';

@Module({
  controllers: [LegalsController, FaqController],
  providers: [LegalsService, FaqService, PrismaService],
})
export class LegalsModule {}
