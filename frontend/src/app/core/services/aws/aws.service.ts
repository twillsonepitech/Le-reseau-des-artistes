import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GetObjectCommand, GetObjectCommandOutput, ListObjectsV2Command,
  PutObjectCommand, PutObjectCommandOutput, S3Client, _Object
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { from, iif, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AwsService {


  private client: S3Client;

  private urlServer = environment.urlServer;

  constructor(
    private http: HttpClient,
  ) {
    this.client = new S3Client({
      region: environment.S3.place,
      endpoint: environment.S3.hostname,
      apiVersion: environment.S3.version,
      credentials: {
        accessKeyId: environment.S3.idAccess,
        secretAccessKey:environment.S3.accessSecret,
      }
    });
  }

  convertToBlob(canvas: HTMLCanvasElement): File {
    const resData = canvas.toDataURL('image/jpeg');
    const byteString = atob(resData.split(',')[1]);
    // separate out the mime component
    const mimeString = resData.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    const blob = new Blob([ab], { type: mimeString });
    return (blob as File);
  }

  fixBase64(binaryData: string) {
    const base64str = binaryData;// base64 string from  thr response of server
    const binary = atob(base64str.replace(/\s/g, ''));// decode base64 string, remove space for IE compatibility
    const len = binary.length;         // get binary length
    const buffer = new ArrayBuffer(len);         // create ArrayBuffer with binary length
    const view = new Uint8Array(buffer);         // create 8-bit Array

    for (let i = 0; i < len; i++) { view[i] = binary.charCodeAt(i); }
    return view;
  }

  /**
   * Upload to amazon server
   *
   * @param file your images,pdf or others ...
   * @param url The path where you want save. Example: "PICTURE/USER/" + this.user.userId + ".jpg"
   * @param acl Access to a file
   */
  uploadAmazon(
    file: File, url: string,
    acl = 'bucket-owner-full-control', width = 2000, height = 2000): Observable<PutObjectCommandOutput> {
      return from(this.uploadFile(url, file, acl));
  }


  uploadFile(Key: string, file: Blob, ACL: string): Observable<PutObjectCommandOutput> {
    const params = {
      Key, Bucket: environment.S3.bucket,
      Body: file, ContentType: file.type, ACL,
    };

    const command = new PutObjectCommand(params);
    return from(this.client.send(command));
  }

  getSignedUrl(Key: string): Promise<string> {
    const params = { Bucket: environment.S3.bucket, Key };
    const command = new GetObjectCommand(params);
    return getSignedUrl(this.client, command);
  }

  /**
   * @param profilId profilId
   * @param agentId If the user change avatar of his profil then send his profil's id. If the
   * user change avatar of his building then send his building's id.
   * @param action  If is a avatar of profil then action is "profil". If is a avatar of building the action is "property"
   */
  addAvatar(profilId: string, agentId: string, action: string, contractId?: string, roleId?: string): Observable<boolean> {

    const url = this.urlServer + '/rest/addAvatar';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let params = new HttpParams();
    if (contractId) { params = params.set('contractId', contractId); }
    if (roleId) { params = params.set('roleId', roleId); }

    return this.http.put<boolean>(url + '/' + profilId + '/' + agentId + '/' + action, '', { headers, params });
  }


  /**
   * Return amazon's folder to Angular
   *
   * @param detailsFolder if user wants more detail about a file, he will have to put the folder concern it
   * @param returnContent Return all content in folder
   */
  getFoldersAmazon(detailsFolder: string): Observable<_Object[]>  {
    const params = { Bucket: environment.S3.bucket, Delimiter: '/', Prefix: detailsFolder };
    const command = new ListObjectsV2Command(params);
    return from(this.client.send(command)).pipe(
      map((res) => res.Contents as  _Object[])
    );
  }

  downloadFileAmazon(Key: string): Observable<boolean | void> {
    return from(this.getFile(Key)).pipe(
      switchMap((data) => new Response((data.Body as ReadableStream), {}).blob()),
      map((res) => {
        const downloadUrl = window.URL.createObjectURL(res);
        const fileName = Key.split('/')[Key.split('/').length - 1];
        const a = document.createElement('a');
        // ... set a.href and a.download
        a.href = downloadUrl;
        a.download = fileName;

        // Then click the link:
        const clickEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: false });
        a.dispatchEvent(clickEvent);
      }),
      catchError(() => {
        return of(false);
      }),
    );
  }

  getFile(Key: string): Observable<GetObjectCommandOutput> {
    const params = { Key, Bucket: environment.S3.bucket };
    const command = new GetObjectCommand(params);
    return from(this.client.send(command));
  }

}
