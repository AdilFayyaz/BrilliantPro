import { Component, OnInit } from '@angular/core';
import {LearnerService} from "../services/learner.service";
import {LearnerInterface} from "../interfaces/LearnerInterface";
import {CoursesService} from "../services/courses.service";
import {CourseDBInterface} from "../interfaces/CourseDBInterface";

@Component({
  selector: 'app-learner',
  templateUrl: './learner.component.html',
  styleUrls: ['./learner.component.css']
})
export class LearnerComponent implements OnInit {

  learners:any[]=[]
  currentLearner:any
  courseNames:string[]=[]
  constructor(private learnerService:LearnerService, private courseService:CoursesService) { }

  ngOnInit(): void {
    this.getAllLearners()
  }

  getAllLearners(){
    this.learnerService.getAllLearners()
      .subscribe((data:LearnerInterface[]) => {
        for (var i=0; i<data.length; i++){
          this.learners.push(data[i])
        }
        this.currentLearner=data[0]
        this.courseNames=[]
        for (var i=0; i<this.currentLearner.courses.length; i++){
          this.getCourseName(this.currentLearner.courses[i].courseId)
        }
        console.log(this.courseNames)
      })
  }

  handleSelect(index:number){
    this.currentLearner=this.learners[index];
    this.courseNames=[]
    for (var i=0; i<this.currentLearner.courses.length; i++){
      this.getCourseName(this.currentLearner.courses[i].courseId)
    }
  }

 getCourseName(id:string):any{
    var name=""
   this.courseService.getCourseInformation(id)
     .subscribe((data:CourseDBInterface[])=>{
       name=data[0].name
       this.courseNames.push(name)
     })
   console.log(id)
 }

}
