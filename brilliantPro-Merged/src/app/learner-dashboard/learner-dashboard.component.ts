import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../services/courses.service';

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
allCourses: any=[]
display = "none";
username:any=this.route.snapshot.paramMap.get('username')
  constructor(private route: ActivatedRoute, private coursesService: CoursesService, private router: Router) {
    this.getCourses(this.username,"completed")
    this.getCourses(this.username,"enrolled")
   }
   display2 ="none";
  getAllCourses(){
    this.coursesService.getAllCourses().subscribe(
      (data)=>{
        for(let i=0;i<data.length;i++){
          this.allCourses.push(data[i])
        }
        console.log("all courses",this.allCourses)
      }
    )
   }
  ngOnInit(): void {
  }
  openModal() {
    this.getAllCourses();
    this.display = "block";
  }
  getEnrollmentLink(id:string){
    this.coursesService.getAllInCourse(id).subscribe(
      (data)=>{
        var link = data[0].enrollmentLink.split("4200")
        this.router.navigate([link[1] + "/" + this.username])
      }
    )
  }
  openPaymentInfo(){
    if(this.display2=="none"){
      this.display2="block";
    }
    else{
      this.display2="none";
    }
  }
  onCloseHandled() {
    this.allCourses = [];
    this.display = "none";
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
      .then(result =>{ console.log("course"+status,JSON.stringify( result))
        if (status=="completed" &&  result.length!=0  ){
          this.completeCourses.push(result)
          console.log("heloo",this.completeCourses)
          this.getCoursesName("completed")
        }
        else if(status=="enrolled"  &&  result.length!=0 ){
          this.unfinishedCourses.push(result)
          console.log("helo0",this.unfinishedCourses)
          this.getCoursesName("enrolled")
        }
      })
      .catch(error => console.log('errr', error));

  }

  getCoursesName(status:string):void{
    // console.log("get course name",this.completeCourses[0].length,JSON.stringify(this.completeCourses[0][0].courseId))
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
