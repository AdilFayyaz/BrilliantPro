import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //  login form
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })
  constructor(private loginservice: LoginService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.loginservice.checkCredentials(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      (data) => {
        // Add navigation to the dashboard
        // Learner Account
        if(data.courses){
          console.log("navigate to learner");
        }
        else{
          console.log("navigate to admin");
        }       
      }
    )
  }
}
