import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<User | undefined>(undefined);
  
  constructor() { }

  public set setUser(user:User){
      this.userSubject.next(user);
  }

  public get getUser$(){
    return this.userSubject.asObservable();
  }

 public get getUser():User{
    return this.userSubject.getValue() as User;
  }

  public  clearUser(): void {
    this.userSubject.next(undefined);
  }

  
}
