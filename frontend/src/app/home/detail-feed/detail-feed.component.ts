import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Feed } from 'src/app/core/models/feed';
import { HomeService } from 'src/app/core/services/home/home.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-detail-feed',
  templateUrl: './detail-feed.component.html',
  styleUrls: ['./detail-feed.component.css']
})
export class DetailFeedComponent implements OnInit {

  public feed:Feed | undefined = undefined;
  
  public commentCtrl = new FormControl({value:'', disabled:true }, Validators.required);
  public currentUser = this.userService.getUser;
  public comments:any[] = [];

  public editModeIndex:undefined | number = undefined;
  constructor(
    private route:ActivatedRoute,
    private homeService:HomeService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((res) =>{ 
        const feedId = res.get('feedId') || '';
        const id =  parseInt(feedId);
        return this.homeService.getFeed(id);
      }),
      switchMap((res) =>{
        this.feed = res[0];
        return this.homeService.getCommentsFeed(this.feed.id);
      }),
      tap((res) => {
          this.comments = res;
      })
    ).subscribe();
  }

  openComment():void {
    this.commentCtrl.enable();
  }

  changeEditMode(i?:number):void{
    this.editModeIndex = i;

  }

  editComment(i:number, value:string){
    this.homeService.editComment(
      this.comments[i].id,
      value,
    ).pipe(
      tap(() => {
        this.comments[i].content = value;
        this.editModeIndex = undefined;
      })
    ).subscribe();
  }
  
  
  deleteComment(i:number):void {
   this.homeService.deleteComment(
     this.comments[i].id
   ).pipe(
     tap(() => {
       this.comments.splice(i, 1);
     })
   ).subscribe();
  }
  

  commentFeed():void {
    if(this.feed){
      this.homeService.commentFeed(
        this.feed.id,
        this.commentCtrl.value, 
    ).pipe(
      tap((res) => {
        this.comments = [res, ...this.comments];
        this.commentCtrl.setValue('');
      })
    ).subscribe();
    }
  }

  likeFeed():void {
    if(this.feed){
    this.homeService.likeFeed(this.feed.id).pipe(
      tap((res) =>{
        if(res && this.feed){
          this.feed.liked = 1;
          this.feed.likes =this.feed.likes + 1;
        }
      })
    ).subscribe();
  }
}
  
  dislikeFeed():void {
    if(this.feed){
      this.homeService.dislikeFeed(this.feed.id).pipe(
        tap((res) =>{
          if(res && this.feed){
            this.feed.liked = 0;
            this.feed.likes =this.feed.likes - 1;
          }
        })
      ).subscribe();
    }

  }

  deletePost():void {
    if(this.feed){
      this.homeService.deleteFeed(this.feed.id).pipe(
        tap((res) => {
          if(res){
          this.router.navigate(['']);
          }
        })
      ).subscribe();
    }

  }
}
