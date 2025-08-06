import { Controller, Get, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Writable } from 'stream';

import { FilesProcessingService } from './files-processing.service';
import { GetInFileRequestDto } from '../dto/getInFileRequest.dto';
import { UploadFileResponseDto } from '../dto/uploadFileResponse.dto';


@ApiTags('Files processing')
@Controller('files')
export class FilesProcessingController {
    constructor(
        private readonly filesProcessingService: FilesProcessingService,
    ) { }

    @ApiOperation({
        summary: 'Download file from URL',
        description: 'Streams file from external URL directly to response. Supports large file downloads.'
    })
    @ApiResponse({
        status: 200,
        description: 'File download successful',
    })
    @Get('getDataInFile')
    async getInFile(
        @Query() query: GetInFileRequestDto,
        @Res() res: Response
    ): Promise<Writable> {
        const { url, fileName } = query;

        const fileData = await this.filesProcessingService.getInFile({ url });

        res.setHeader('Content-Type', 'application/octet-stream');
        if (fileName) {
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        }
        return fileData.pipe(res)
    }

    @Post('upload')
    @ApiOperation({ summary: 'Upload and parse file', description: 'Upload .json, .xlsx or .xls file and save its contents to MongoDB' })
    @ApiResponse({ status: 201, description: 'File successfully uploaded and parsed', type: UploadFileResponseDto })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: 'multipart/form-data',
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' }
            },
            required: ['file']
        }
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        // const id = this.filesProcessingService.parseAndSaveFile(file);
        // return { id };
    }
}