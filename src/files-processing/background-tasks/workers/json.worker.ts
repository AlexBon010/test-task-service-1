// import { UploadedFileService } from "@db";
// import { Injectable } from "@nestjs/common";
// import { pipeline, Writable, Readable } from "stream";
// import { parser } from "stream-json"
// import { streamValues } from 'stream-json/streamers/StreamValues';
// import { parentPort } from "worker_threads";

// const writable = new Writable({
//     objectMode: true,
//     async write(chunk, _encoding, callback) {
//         try {
//             const idFromDb = await uploadService.create({
//                 originalFileName: "test.json",
//                 fileType: "json",
//                 records: chunk,
//                 fields: Object.keys({}),
//                 totalRecords: 0,
//             })
//             parentPort?.postMessage(idFromDb)
//         } catch (err) {
//             callback(err);
//         }
//     }
// })

// parentPort?.on("message", (message: Buffer) => {
//     pipeline(
//         Readable.from(message, {
//             highWaterMark: 1024 * 1024 * 10,
//         }),
//         parser(),
//         streamValues(),
//         writable,
//     )
// })

// @Injectable()
// export class JsonService {

//     constructor(private readonly uploadedFileService: UploadedFileService) {
//     }

//     parseJson() {
//         const uploadService = this.uploadedFileService
//         const writable = new Writable({
//             objectMode: true,
//             async write(chunk, _encoding, callback) {
//                 try {
//                     const idFromDb = await uploadService.create({
//                         originalFileName: "test.json",
//                         fileType: "json",
//                         records: chunk,
//                         fields: Object.keys({}),
//                         totalRecords: 0,
//                     })
//                     parentPort?.postMessage(idFromDb)
//                 } catch (err) {
//                     callback(err);
//                 }
//             }
//         })

//         parentPort?.on("message", (message: Buffer) => {
//             pipeline(
//                 Readable.from(message, {
//                     highWaterMark: 1024 * 1024 * 10,
//                 }),
//                 parser(),
//                 streamValues(),
//                 writable,
//             )
//         })
//     }
// }



