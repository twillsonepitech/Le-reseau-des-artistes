import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Feed, LikedMarks } from 'src/app/core/models/feed';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { HomeService } from 'src/app/core/services/home/home.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public feeds: LikedMarks[]= [];
  public currentUser = this.userService.getUser;

  
  constructor(
    private router:Router,
    private authService:AuthService,
    private homeService:HomeService,
    private userService:UserService,
  ) { }


  ngOnInit(): void {
    this.homeService.getFeedsLiked(
      this.currentUser.id
    ).pipe(
      tap((res) => this.feeds = res)
    ).subscribe();
  }



dislikeFeed(i:number):void {
  this.homeService.dislikeFeed(this.feeds[i].id).pipe(
    tap((res) =>{
      if(res){
        this.feeds.splice(i, 1);
      }
    })
  ).subscribe();
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


  goTodetail(i:number): void {
    this.router.navigate(['home/feed', this.feeds[i].post_id]);
  }
}
