import { Module } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { CartController } from './cart.controller.js';
import { PrismaService } from '../../../src/services/prisma.service.js';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService],
})
export class CartModule {}
