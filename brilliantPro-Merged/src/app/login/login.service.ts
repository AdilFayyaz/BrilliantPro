import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
   isadmin$: any;

  constructor(private httpclient: HttpClient) {

   }
  private isAdmin = new BehaviorSubject(false);
 currentIsAdmin = this.isAdmin.asObservable();



  checkAdmin(position: boolean): void{

    this.isAdmin.next(position)
  }
  getIsAdmin(position: boolean): boolean{
  
    return(this.isadmin$)
  }
  checkCredentials(username: string, password: string): Observable<any>{
    // this.isadmin$.next(true);
   return this.httpclient.post('http://localhost:3000/login', {username: username, password: password});
  }
}
