import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
   isadmin$: any;

  constructor(private httpclient: HttpClient) { }
  // private eventCallback = new Subject<boolean>(); // Source
  // eventCallback$ = this.eventCallback.asObservable(); // Stream

  checkAdmin(position: boolean): void{
  
    this.isadmin$=position
    console.log("---",this.isadmin$)
  }
  getIsAdmin(): boolean{
  
    return(this.isadmin$)
  }
  checkCredentials(username: string, password: string): Observable<any>{
    // this.isadmin$.next(true);
   return this.httpclient.post('http://localhost:3000/login', {username: username, password: password});
  }
}
