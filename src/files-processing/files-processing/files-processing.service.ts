import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { pipeline, Readable, ReadableOptions, StreamOptions, Transform, Writable } from 'stream';
import * as XLSX from 'xlsx';
import { parser } from "stream-json"
import { streamValues } from 'stream-json/streamers/StreamValues';
import { chain } from 'stream-chain';


import { GetInFileRequestDto } from '../dto/getInFileRequest.dto';
import { UploadedFileService, UploadedFile } from '@db';
import { createReadStream } from 'fs';

@Injectable()
export class FilesProcessingService {
    constructor(
        private readonly httpService: HttpService,
        private readonly uploadedFileService: UploadedFileService
    ) { }

    async getInFile({ url }: GetInFileRequestDto) {
        try {
            const response = await this.httpService.axiosRef.get<Readable>(url, { responseType: 'stream' })
            return response.data
        } catch (error) {
            throw new BadRequestException(`Failed to get file from URL: ${error.message}`);
        }
    }

    parseAndSaveFile(file: Express.Multer.File) {
        const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
        if (!fileExtension || !['json', 'xlsx', 'xls'].includes(fileExtension)) {
            throw new BadRequestException('Unsupported file type. Only .json, .xlsx and .xls files are supported');
        }

        const uploadService = this.uploadedFileService

        const writable = new Writable({
            objectMode: true,
            async write(chunk, _encoding, callback) {
                try {
                    const parsedChunk = JSON.parse(JSON.stringify(chunk)).value
                    const quantity = Math.ceil(parsedChunk.length / 50000)
                    const docRef = await uploadService.create({
                        originalFileName: file.originalname,
                        fileType: fileExtension,
                        records: [],
                        fields: [],
                        totalRecords: 0,
                    })
                    // for (let i = 0; i <= quantity; i++) {
                    const l = parsedChunk.slice(0 * 50000, (0 + 1) * 50000)
                    await uploadService.addRecord(docRef, l)
                    console.log("write", l);
                    // }

                    // await uploadService.create({
                    //     originalFileName: file.originalname,
                    //     fileType: fileExtension,
                    //     records: chunk,
                    //     fields: Object.keys({}),
                    //     totalRecords: 0,
                    // });

                    callback();
                } catch (err) {
                    callback(err);
                }
            }
        });

        return new Promise((resolve, reject) => {
            pipeline(
                Readable.from(file.buffer, {
                    highWaterMark: 1024 * 1024 * 10,
                }),
                parser(),
                streamValues(),
                writable,
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(null);
                    }
                }
            );
        });



        // const parsingResult = {
        //     originalFileName: file.originalname,
        //     fileType: fileExtension,
        // } as UploadedFile
        // parser("sd")
        // if (fileExtension === 'json') {
        //     const { records, fields } = await this.parseJson(file.buffer)

        //     parsingResult.records = records
        //     parsingResult.fields = [...fields]
        //     parsingResult.totalRecords = records.length
        // }

        // if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        //     const { records, fields } = this.parseExcel(file.buffer)
        //     parsingResult.records = records
        //     parsingResult.fields = [...fields]
        //     parsingResult.totalRecords = records.length
        // }

        // return this.uploadedFileService.create(parsingResult);
    }

    // private async parseJson(buffer: ): Promise<{
    //     records: Record<string, any>[];
    //     fields: Set<string>;
    // }> {
    //     return new Promise((resolve, reject) => {
    //         const fields = new Set<string>();
    //         const records: Record<string, any>[] = [];

    //         const readable = new Readable(buffer);

    //         let accumulatedData = '';

    //         readable.on('data', (chunk) => {
    //             accumulatedData += chunk.toString();
    //         });

    //         readable.on('end', () => {
    //             try {
    //                 const parsed = JSON.parse(accumulatedData);

    //                 parsed.forEach(obj => {
    //                     records.push(obj);
    //                     Object.keys(obj).forEach(k => fields.add(k));
    //                 });

    //                 resolve({ records, fields });
    //             } catch (error) {
    //                 if (error instanceof BadRequestException) {
    //                     reject(error);
    //                 } else {
    //                     reject(new BadRequestException('Failed to parse JSON'));
    //                 }
    //             }
    //         });

    //         readable.on('error', (error) => {
    //             reject(new BadRequestException('Stream error while parsing JSON'));
    //         });
    //     });
    // }

    // private parseExcel(buffer: Buffer): { records: Record<string, any>[]; fields: Set<string> } {
    //     const workbook = XLSX.read(buffer, { type: 'buffer' });
    //     const sheet = workbook.Sheets[workbook.SheetNames[0]];
    //     const records = XLSX.utils.sheet_to_json(sheet);

    //     if (!Array.isArray(records) || records.length === 0) {
    //         throw new BadRequestException('Excel file contains no valid records');
    //     }

    //     const fields = new Set<string>();
    //     records.forEach(obj => Object.keys(obj).forEach(k => fields.add(k)));

    //     return { records, fields };
    // }
}