import { animation } from '@angular/animations';
import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import { title } from 'process';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[LoginService]
})
export class AppComponent {
 isAdmin=true
constructor(private service: LoginService){
 console.log("admmin",service.isadmin$)

}
getAdmin(){
  console.log("ifadmin",this.service.getIsAdmin())
  this.isAdmin=this.service.getIsAdmin()
return this.service.getIsAdmin()
}

  title = 'FrontEnd';
  active="dashboard"
  animation=true;
}
