import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { LoginService } from './login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //  login form
  loginForm = new UntypedFormGroup({
    username: new UntypedFormControl(''),
    password: new UntypedFormControl('')
  })
  constructor(private loginservice: LoginService, private router:Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.loginservice.checkCredentials(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      (data) => {
        // Add navigation to the dashboard
        // Learner Account
        if(data.courses){
          console.log("navigate to learner");
          this.router.navigateByUrl('/learnerDashboard')
        }
        else{
          console.log("navigate to admin");
          this.router.navigateByUrl('/dashboard');

        }
      }
    )
  }
}
