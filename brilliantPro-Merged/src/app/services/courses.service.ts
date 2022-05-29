import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {CoursesInterface} from "../interfaces/coursesInterface";
import {CourseLearnerInterface} from "../interfaces/CourseLearnerInterface";
import {CourseDBInterface} from "../interfaces/CourseDBInterface";
import {FolderInterface, MaterialInterface} from "../interfaces/MaterialInterface";
import {AssessmentInterface} from "../interfaces/AssessmentInterface";
import {LearnerInterface} from "../interfaces/LearnerInterface";


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
  getAllInCourse(id:string){
    return this.http.get<any>("http://localhost:3000/admin/allCourseLearners/courseId/"+id);
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
  getAllMaterials(){
    return this.http.get<FolderInterface[]>("http://localhost:3000/admin/allFolders");
  }
  getMaterialInformation(id:string){
    return this.http.get<FolderInterface[]>("http://localhost:3000/admin/getFolderMaterial/"+id);
  }
  getAllAssessments(){
    return this.http.get<AssessmentInterface[]>("http://localhost:3000/admin/allAssessments");
  }
  getAssessmentInformation(id:string){
    return this.http.get<AssessmentInterface[]>("http://localhost:3000/admin/getAssessment/"+id);
  }
  updateCourse(c:CourseDBInterface){
    return this.http.post("http://localhost:3000/admin/updateCourse", c);
  }

  uploadImage(image:File){
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post("http://localhost:3000/admin/uploadImage", formData,  {responseType: 'text' });
  }

  newCourse(c:CourseDBInterface){
    return this.http.post("http://localhost:3000/admin/newCourse", c);
  }

  deleteCourse(c:CourseDBInterface){
    return this.http.post("http://localhost:3000/admin/deleteCourse", c);
  }

}
