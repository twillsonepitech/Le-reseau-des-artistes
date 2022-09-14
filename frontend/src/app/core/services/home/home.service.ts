import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Feed, LikedMarks } from '../../models/feed';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private urlServer = environment.urlServer;

  constructor(
    private httpClient:HttpClient,
    ) { }

  sendFeed(content:string, has_file:boolean): Observable<Feed[]> {
    return this.httpClient.post<Feed[]>(`${this.urlServer}/post`, { content, has_file });
  }

  getFeeds(): Observable<Feed[]> {
    return this.httpClient.get<Feed[]>(`${this.urlServer}/posts`); 
  }

  getFeed(post_id:number): Observable<Feed[]> {
    return this.httpClient.get<Feed[]>(`${this.urlServer}/getPost/${post_id}`); 
  }

  getCommentsFeed(post_id:number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.urlServer}/getCommentsPost/${post_id}`); 
  }


  getFeedsLiked(user_id:number): Observable<LikedMarks[]> {
    return this.httpClient.get<LikedMarks[]>(`${this.urlServer}/postsLiked/${user_id}`); 
  }

  getFeedsSaved(user_id:number): Observable<LikedMarks[]> {
    return this.httpClient.get<LikedMarks[]>(`${this.urlServer}/postsSaved/${user_id}`); 
  }

  getMyFeeds(userId: number): Observable<Feed[]> {
    return this.httpClient.get<Feed[]>(`${this.urlServer}/posts/${userId}` );
  }

  deleteFeed(post_id:number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.urlServer}/post/${post_id}`); 
  }

  deleteComment(comment_id:number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.urlServer}/deleteComment/${comment_id}`); 
  }

  editComment(comment_id:number, content:string): Observable<boolean> {
    return this.httpClient.put<boolean>(`${this.urlServer}/updateComment/${comment_id}`, { content }); 
  }

  likeFeed(post_id:number): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.urlServer}/favorite/${post_id}`, ''); 
  }

  dislikeFeed(post_id:number): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.urlServer}/dislike/${post_id}`, ''); 
  }

  commentFeed(post_id:number, content:string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.urlServer}/createComment/${post_id}`, { content }); 
  }

  addBookmark(post_id: number): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.urlServer}/savePost/${post_id}`, ''); 
  }

  
  deleteBookmark(post_id: number): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.urlServer}/unsavePost/${post_id}`, ''); 
  }

}
