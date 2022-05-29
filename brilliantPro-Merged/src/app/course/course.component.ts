import { Component, OnInit } from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {CoursesInterface} from "../interfaces/coursesInterface";
import {CourseDBInterface} from "../interfaces/CourseDBInterface";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CourseDetailsComponent} from "../course-details/course-details.component";
import {AddCourseComponent} from "../add-course/add-course.component";
import {CourseLearnerInterface} from "../interfaces/CourseLearnerInterface";
import {LearnerService} from "../services/learner.service";
import {LearnerInterface} from "../interfaces/LearnerInterface";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courses:any[]=[]
  constructor(private coursesService:CoursesService, private modalService: NgbModal, private learnerService:LearnerService) { }

  ngOnInit(): void {
    this.getAllFullCourses();
  }

  getAllFullCourses(){
    this.coursesService.getAllFullCourses().subscribe((data:CourseDBInterface[])=>
    {
      this.courses=data;
    })
  }

  open(course:CourseDBInterface){
    console.log("opening for ", course.name)
    const modalRef = this.modalService.open(CourseDetailsComponent);
    modalRef.componentInstance.course = course;
    modalRef.componentInstance.image = course.image;
  }

  new(){
    const modalRef = this.modalService.open(AddCourseComponent);
    modalRef.componentInstance.courses=this.courses;
  }

  delete(c:CourseDBInterface, index:number){
      this.coursesService.getAllInCourse(c._id).subscribe((data:CourseLearnerInterface[])=>{
        console.log(data)
        for (let i=0; i<data[0].learnerDetails.length; i++){
          this.learnerService.getLearnerInformation(data[0].learnerDetails[i]._id).subscribe((data:LearnerInterface[])=>{
            let tempLearner=data[0];
            for (let j=0; j<tempLearner.courses.length; j++){
              if (tempLearner.courses[j].courseId==c._id){
                tempLearner.courses.splice(j, 1)
                this.learnerService.updateLearner(tempLearner).subscribe((data)=>{
                  console.log(data)
                  console.log("Course Deleted from Learner")
                })
              }
            }
        })
      }
        this.coursesService.deleteCourse(c).subscribe((data:any)=>{this.courses.splice(index, 1); console.log("course deleted")})
    })
  }

}
