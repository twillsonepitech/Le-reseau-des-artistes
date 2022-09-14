import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AwsFile, AwsFileType } from '../models/aws-file';
import { AwsService } from '../services/aws/aws.service';


@Pipe({ name: 'getAmazonFiles' })
export class GetAmazonFilesPipe implements PipeTransform {
  constructor(
    private awsService: AwsService,
    private sanitizer: DomSanitizer,
  ) { }

  transform(url: string, isNew = false): Observable<AwsFile[]> {
    return isNew ? timer(2000).pipe(switchMap(() => this.getFoldersAmazon(url))) : this.getFoldersAmazon(url);
  }

  getFoldersAmazon(url: string): Observable<AwsFile[]> {
   return timer(1000).pipe(
      switchMap(() =>this.awsService.getFoldersAmazon(url)),
      map((data) => {
        const files = [] as AwsFile[];
        const file = {} as AwsFile;
        console.log(data);
        data.forEach(async(attachment) => {
          const key = attachment.Key as string;
          const fileSigned = await this.awsService.getSignedUrl(key);
          file.url = this.sanitizer.bypassSecurityTrustResourceUrl(fileSigned);
          file.fullName = key.substring(key.lastIndexOf('/') + 1);
          const typeFile = file.fullName.substring(file.fullName.lastIndexOf('.') + 1) as keyof typeof AwsFileType;
          file.typeFile = AwsFileType[typeFile];
          console.log(file.typeFile);
          files.push(file);
        });
        console.log(files);
        return files;
      })
    );
  }
}
