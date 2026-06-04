import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from './cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('upload')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('image/:publicId')
  async deleteImage(@Param('publicId') publicId: string) {
    await this.cloudinaryService.deleteImage(publicId);
    return { message: 'Image deleted successfully' };
  }
}