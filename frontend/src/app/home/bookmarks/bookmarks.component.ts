import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LikedMarks } from 'src/app/core/models/feed';
import { HomeService } from 'src/app/core/services/home/home.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit {

  public feeds: LikedMarks[] = [];

  public currentUser = this.userService.getUser;

  constructor(
    private homeService: HomeService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.homeService.getFeedsSaved(this.currentUser.id).pipe(
      tap((res) => this.feeds = res)
    ).subscribe();
  }

deleteBookmark(i:number):void {
  this.homeService.deleteBookmark(this.feeds[i].id).pipe(
    tap((res) =>{
      if(res){
        this.feeds.splice(i, 1);
      }
    })
  ).subscribe();
}


goTodetail(i:number): void {
  this.router.navigate(['home/feed', this.feeds[i].post_id]);
}

  deletePost(i:number):void {
    this.homeService.deleteFeed(this.feeds[i].id).pipe(
      tap((res) => {
        if(res){
          this.feeds.splice(i, 1);
        }
      })
    ).subscribe();
  }
}
