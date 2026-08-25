import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller.js';
import { WishlistService } from './wishlist.service.js';
import { PrismaService } from '../../services/prisma.service.js';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService, PrismaService],
  exports: [WishlistService],
})
export class WishlistModule {}
