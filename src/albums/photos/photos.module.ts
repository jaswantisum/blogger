import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from '../entities/album.entity';
import { Photo } from './entities/photo.entity';
import { AlbumsService } from '../albums.service';

@Module({
  controllers: [PhotosController],
  providers: [PhotosService,AlbumsService],
  imports: [TypeOrmModule.forFeature([Album, Photo])],
})
export class PhotosModule {}
