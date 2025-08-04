import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FilesProcessingService } from './files-processing.service';
import { GetInFileRequestDto } from '../dto/getInFileRequest.dto';
import { FileDownloadResponseDto } from '../dto/getInFileResponse.dto';


@ApiTags('Files processing')
@Controller('files')
export class FilesProcessingController {
    constructor(
        private readonly filesProcessingService: FilesProcessingService
    ) { }

    @ApiOperation({
        summary: 'Download file from URL',
        description: 'Streams file from external URL directly to response. Supports large file downloads.'
    })
    @ApiResponse({
        status: 200,
        description: 'File download successful',
        type: FileDownloadResponseDto
    })
    @Get('getDataInFile')
    async getInFile(
        @Query() query: GetInFileRequestDto,
        @Res() res: Response
    ) {
        const { url, fileName } = query;

        const fileData = await this.filesProcessingService.getInFile({ url });

        res.setHeader('Content-Type', 'application/octet-stream');
        if (fileName) {
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        }
        return fileData.pipe(res)
    }
}