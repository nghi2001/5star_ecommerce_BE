import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { WishlistController } from './wishlist.controller';
import { WishlistRepository } from './wishlist.repository';
import { WishlistService } from './wishlist.service';

@Module({
  controllers: [
    WishlistController
  ],
  providers: [
    WishlistService,
    WishlistRepository
  ],
  imports: [
    ProductModule
  ]
})
export class WishlistModule { }
