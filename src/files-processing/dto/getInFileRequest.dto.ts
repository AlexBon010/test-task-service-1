import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class GetInFileRequestDto {
    @ApiProperty({
        description: 'The URL of the file to download',
        example: 'https://jsonplaceholder.typicode.com/posts',
        required: true
    })
    @IsUrl()
    url: string;

    @ApiProperty({
        description: 'Custom filename for the downloaded file',
        example: 'data-export.json',
        required: false
    })
    @IsOptional()
    @IsString()
    fileName?: string;
}