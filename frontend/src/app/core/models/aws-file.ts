import { SafeResourceUrl } from '@angular/platform-browser';
import { _Object } from '@aws-sdk/client-s3';

export type AwsFile = _Object & {
    url?: SafeResourceUrl;
    fullName: string;
    typeFile: string;
    fileToSend?: Blob;
    fileData?: Uint8Array;
};


export enum AwsFileType {
    jpg = 'img',
    png = 'img',
    jpeg = 'img',
    mp4 = 'video',
}