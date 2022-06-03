import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpclient: HttpClient) { }
  checkCredentials(username: string, password: string): Observable<any>{
   return this.httpclient.post('http://localhost:3000/login', {username: username, password: password});
  }
}
