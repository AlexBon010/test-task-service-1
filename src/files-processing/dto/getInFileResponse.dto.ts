import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FileMetadataDto {
    @ApiProperty({ example: 'data-export.json', description: 'File name' })
    @Expose()
    filename: string;

    @ApiProperty({ example: '1.5MB', description: 'Human-readable file size' })
    @Expose()
    size: string;

    @ApiProperty({ example: 'application/json', description: 'MIME type of the file' })
    @Expose()
    mimeType: string;
}

export class FileDownloadResponseDto {
    @ApiProperty({ example: 'success', description: 'Status of file download request' })
    @Expose()
    status: string;

    @ApiProperty({ type: FileMetadataDto, description: 'Metadata of the file' })
    @Expose()
    metadata: FileMetadataDto;
}
