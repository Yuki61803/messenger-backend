import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage} from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

@Controller('/api/v1/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('file', 20, {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          let filename = uuidv4() + path.extname(file.originalname);
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadedFile(@UploadedFiles() files) {
    //TODO
    let response: any = [];
    for (let file of files) {
      const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

      response.push({
        uploadedSlug: file.filename,
        originalName: originalname
      });
    }
    
    return response;
  }
}