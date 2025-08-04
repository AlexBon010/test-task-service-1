import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

import { GetInFileRequestDto } from '../dto/getInFileRequest.dto';

@Injectable()
export class FilesProcessingService {
    constructor(private readonly httpService: HttpService) { }

    async getInFile({ url }: GetInFileRequestDto) {
        const response = await this.httpService.axiosRef.get<Readable>(url, { responseType: 'stream' })
        return response.data
    }
}
