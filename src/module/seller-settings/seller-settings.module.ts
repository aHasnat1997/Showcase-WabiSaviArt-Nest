import { Module } from '@nestjs/common';
import { PrismaService } from '../../../src/services/prisma.service.js';
import { SellerSettingsController } from './seller-settings.controller.js';
import { SellerSettingsService } from './seller-settings.service.js';

@Module({
  controllers: [SellerSettingsController],
  providers: [SellerSettingsService, PrismaService],
})
export class SellerSettingsModule {}
