// cloudinary.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary.response';

const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(File: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            reject(error);
          } else if (!result) {
            reject(new Error('No result from Cloudinary upload'));
          } else {
            resolve(result);
          }
        },
      );

      streamifier.createReadStream(File.buffer).pipe(uploadStream);
    });
  }

  // Borrar imagen usando URL
  async deleteFile(fileUrl: string): Promise<{ result: string }> {
    try {
      // Extraer public_id de la URL
      const urlParts = fileUrl.split('/');
      const filenameWithExt = urlParts[urlParts.length - 1]; // ejemplo: 'miimagen.jpg'
      const publicId = filenameWithExt.split('.')[0]; // 'miimagen'

      const result = await cloudinary.uploader.destroy(publicId);
      return result; // normalmente { result: 'ok' } o { result: 'not found' }
    } catch (error) {
      throw error;
    }
  }
}
