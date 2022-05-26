import { Component, OnInit } from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {CoursesInterface} from "../interfaces/coursesInterface";
import {CourseDBInterface} from "../interfaces/CourseDBInterface";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courses:any[]=[]
  constructor(private coursesService:CoursesService) { }

  ngOnInit(): void {
    this.getAllFullCourses();
  }

  getAllFullCourses(){
    this.coursesService.getAllFullCourses().subscribe((data:CourseDBInterface[])=>
    {
      this.courses=data;
    })
  }

}
