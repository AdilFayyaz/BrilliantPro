import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-learner-dashboard',
  templateUrl: './learner-dashboard.component.html',
  styleUrls: ['./learner-dashboard.component.css']
})
export class LearnerDashboardComponent implements OnInit {
completeCourses:any=[];
completeCoursesNames:any=[];
unfinishedCourses:any=[];
unfinishedCoursesNames:any=[];

username:any="hurriya1"
  constructor() {
    this.getCourses(this.username,"completed")
    this.getCourses(this.username,"enrolled")
   }

  ngOnInit(): void {
    
   
  }
 getCourses(username:string,status:string):void{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
 
    
    var requestOptions = {}
    requestOptions={
      method: 'GET',
      headers: myHeaders,

      redirect: 'follow'
    };
    
    fetch("http://127.0.0.1:3000/learner/"+username+"/status/"+status, requestOptions)
      .then(response => response.json())
      .then(result =>{ console.log("compleete",JSON.stringify( result))
        if (status=="completed"){
          this.completeCourses.push(result)
          console.log("heloo",this.completeCourses)
          this.getCoursesName("completed")
        }
        else if(status=="enrolled"){
          this.unfinishedCourses.push(result)
          console.log("helo0",this.unfinishedCourses)
          this.getCoursesName("enrolled")
        }
      })
      .catch(error => console.log('errr', error));

  }

  getCoursesName(status:string):void{
    console.log("here",this.completeCourses[0].length,JSON.stringify(this.completeCourses[0][0].courseId))
    var requestOptions = {}
    requestOptions={
      method: 'GET',
      redirect: 'follow'
    };
    let categ=(status=="completed")?(this.completeCourses[0]):(this.unfinishedCourses[0])

      for(let i=0;i<categ.length;i++){
       let x=categ[i].courseId
        fetch("http://127.0.0.1:3000/learner/courseName/"+x, requestOptions)
          .then(response => response.json())
          .then(result => {console.log("0000",result[0].name)
          if(status=="completed"){
          this.completeCoursesNames.push(result[0])
        
            }
           else if(status=="enrolled"){
              this.unfinishedCoursesNames.push(result[0])
            
                }
         })
          .catch(error => console.log('eror', error));
    }
  }
}
