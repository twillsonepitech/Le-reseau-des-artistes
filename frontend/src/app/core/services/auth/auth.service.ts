import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthResponse } from '../../models/token';
import { UserService } from '../user/user.service';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlServer = environment.urlServer;

  private tokenSubject:BehaviorSubject<string>;

  constructor(
    private httpClient:HttpClient,
    private userService:UserService,
    ) {
   const token = localStorage.getItem('token') || '';
   this.tokenSubject = new BehaviorSubject<string>(token);
   }

   public init(){
    const token = localStorage.getItem('token') || '';
    this.tokenSubject = new BehaviorSubject<string>(token);
    if(token){
      return this.me().pipe(
        map(() => true)
      );
    }
    return of(true);
   }

  public get getToken(): string {
    return this.tokenSubject.getValue();
  } 

  public get getToken$():Observable<string>{
    return this.tokenSubject.asObservable();
  }

  private storeToken(access_token:string){
    this.tokenSubject.next(access_token);
    localStorage.setItem('token',access_token);
  }

 public login(email:string, password:string): Observable<void> {
    return this.httpClient.post<AuthResponse>(`${this.urlServer}/login`, { email, password }).pipe(
      tap(({access_token}) =>{
        this.storeToken(access_token);
      }),
      switchMap(() => this.me()),
    );
  }

  public register(name:string, email:string, password:string): Observable<void> {
    return this.httpClient.post<AuthResponse>(`${this.urlServer}/register`, { name, email, password }).pipe(
      tap(({access_token}) =>{
        this.storeToken(access_token);
      }),
      switchMap(() => this.me()),
    );
  }

  public me():Observable<void> {
    return this.httpClient.post<User>(`${this.urlServer}/me`, '').pipe(
      map((res) =>{
        this.userService.setUser = res;
      })
    );
  }

  public logout():void {
    localStorage.clear();
    this.userService.clearUser();
    }

    public deleteUser():Observable<boolean> {
      return this.httpClient.delete<boolean>(`${this.urlServer}/deleteUser`).pipe(
        tap((res) =>{
          localStorage.removeItem('token');
          this.userService.clearUser();
        })
      );
  }
}
