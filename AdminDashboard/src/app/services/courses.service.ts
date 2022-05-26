import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {CoursesInterface} from "../interfaces/coursesInterface";
import {CourseLearnerInterface} from "../interfaces/CourseLearnerInterface";
import {CourseDBInterface} from "../interfaces/CourseDBInterface";


@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http:HttpClient) { }

  getLearnersCount(){
    return this.http.get<string>("http://localhost:3000/admin/totalLearners");
  }

  getMaterialsCount(){
    return this.http.get<string>("http://localhost:3000/admin/totalMaterials");
  }

  getCertificatesCount(){
    return this.http.get<string>("http://localhost:3000/admin/totalCompleted");
  }
  getEnrolledCoursesCount(){
    return this.http.get<string>("http://localhost:3000/admin/totalEnrolled");
  }

  getAllCourses(){
    return this.http.get<CoursesInterface[]>("http://localhost:3000/admin/allCourses");
  }

  getAllFullCourses(){
    return this.http.get<CourseDBInterface[]>("http://localhost:3000/admin/allFullCourses");
  }

  getEnrolledInCourse(id:string){
    return this.http.get<any>("http://localhost:3000/admin/enrolledCourseLearners/courseId/"+id);
  }
  getPassedInCourse(id:string){
    return this.http.get<any>("http://localhost:3000/admin/passCourseLearners/courseId/"+id);
  }
  getFailedInCourse(id:string){
    return this.http.get<any>("http://localhost:3000/admin/failCourseLearners/courseId/"+id);
  }
  getStartersInCourse(id:string){
    return this.http.get<any>("http://localhost:3000/admin/startedCourseLearners/courseId/"+id);
  }
  getMidwayInCourse(id:string){
    return this.http.get<any>("http://localhost:3000/admin/halfCourseLearners/courseId/"+id);
  }

  getCourseInformation(id:string){
    return this.http.get<CourseDBInterface[]>("http://localhost:3000/admin/getCourse/"+id);
  }
}
