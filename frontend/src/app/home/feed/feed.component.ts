import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { iif, Observable, of, zip } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { Feed } from 'src/app/core/models/feed';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AwsService } from 'src/app/core/services/aws/aws.service';
import { HomeService } from 'src/app/core/services/home/home.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  public contentCtrl = new FormControl('', Validators.required);
  public indexComment: undefined | number = undefined;

  public feeds: Feed[]= [];
  public file:File | undefined;
  public currentUser = this.userService.getUser;

  constructor(
    private homeService: HomeService,
    private userService: UserService,
    private awsService: AwsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.homeService.getFeeds().pipe(
      tap((res) => this.feeds = res)
    ).subscribe();
  }

  removeFile():void {
    this.file = undefined;
  }

  sendFeed():void {
    if(this.contentCtrl.valid || this.file) {
    this.homeService.sendFeed(
      this.contentCtrl.value,
      !!this.file
    ).pipe(
      tap((res) =>{
      this.feeds = [ ...res, ...this.feeds];
      this.contentCtrl.setValue('');
      }),
      switchMap((res) =>  iif(() => !!this.file, this.uploadAttachment(res[0].id), of(true) ))
    ).subscribe();
  }
}

uploadAttachment(attachmentId: number): Observable<PutObjectCommandOutput> {
  const file = this.file as File;
  const url = 'takerfiles/' + attachmentId + '/' + file.name;
 return  this.awsService.uploadAmazon(file, url).pipe(
   finalize(() => {
     this.removeFile();
   })
 )
}

uploadFile($event:any):void {
  this.file = $event.target.files[0];
}

addBookmark(i:number):void {
this.homeService.addBookmark(this.feeds[i].id).pipe(
  tap((res) =>{
    if(res){
      this.feeds[i].saved = 1;
    }
  })
).subscribe();
}

deleteBookmark(i:number):void {
  this.homeService.deleteBookmark(this.feeds[i].id).pipe(
    tap((res) =>{
      if(res){
        this.feeds[i].saved = 0;
      }
    })
  ).subscribe();
}

likeFeed(i:number):void {
  this.homeService.likeFeed(this.feeds[i].id).pipe(
    tap((res) =>{
      if(res){
        this.feeds[i].liked = 1;
        if(!this.feeds[i].likes){  this.feeds[i].likes = 1;  }
        else if(!this.feeds[i].likes){  this.feeds[i].likes = this.feeds[i].likes + 1;  }
      }
    })
  ).subscribe();
}

dislikeFeed(i:number):void {
  this.homeService.dislikeFeed(this.feeds[i].id).pipe(
    tap((res) =>{
      if(res){
        this.feeds[i].liked = 0;
        this.feeds[i].likes = this.feeds[i].likes - 1;
      }
    })
  ).subscribe();
}

  goTodetail(i:number): void {
    this.router.navigate(['home/feed', this.feeds[i].id]);
  }


  deletePost(i:number){
    this.homeService.deleteFeed(this.feeds[i].id).pipe(
      tap((res) => {
        if(res){
          this.feeds.splice(i, 1);
        }
      })
    ).subscribe();
  }
}
