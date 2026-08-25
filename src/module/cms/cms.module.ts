import { Module } from '@nestjs/common';
import { CmsService } from './cms.service.js';
import { CmsController } from './cms.controller.js';
import { PrismaService } from '../../services/prisma.service.js';

@Module({
  controllers: [CmsController],
  providers: [CmsService, PrismaService],
})
export class CmsModule {}
