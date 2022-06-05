import { animation } from '@angular/animations';
import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import { title } from 'process';
// import { LoginService } from './login/login.service';
import { LoginService } from "../app/login/login.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[LoginService]
})
export class AppComponent {

approvalText:string="";
message:boolean=true;
isAdmin=true;

constructor(private service: LoginService){
 console.log("admmin",service.isadmin$)

}


ngOnInit() {
  this.service.currentIsAdmin.subscribe(msg => this.isAdmin = msg);
console.log("msggg",this.isAdmin)

}



  title = 'FrontEnd';
  active="dashboard"
  animation=true;
}
