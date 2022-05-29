import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDate, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {AssessmentInterface} from "../interfaces/AssessmentInterface";
import {FolderInterface, MaterialInterface} from "../interfaces/MaterialInterface";
import {AssessmentInCourse, CourseDBInterface} from "../interfaces/CourseDBInterface";
import {CoursesService} from "../services/courses.service";
import {CourseInLearner, LearnerInterface} from "../interfaces/LearnerInterface";
import {CourseLearnerInterface} from "../interfaces/CourseLearnerInterface";
import {LearnerService} from "../services/learner.service";
interface Alert{
  type:string,
  message:string;
}
@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})



export class CourseDetailsComponent implements OnInit {

  @Input() course: any;
  @Input() image : any;
  active=1;
  allAssessments:AssessmentInterface[]=[]
  allMaterials:MaterialInterface[]=[]

  courseAssessments:AssessmentInterface[]=[]
  courseMaterials:MaterialInterface[]=[]
  newAssessment=false
  newMaterial=false
  newLearner=false;
  selectedAssessment:AssessmentInterface={
    _id: "", minPassing: 0, name: "Select Assessment", questions: [], time: 0
  }
  selectedMaterial:MaterialInterface={_id: "", isDownloadable: false, name: "Choose Material", path: "", type: ""}
  enrolledLearners:LearnerInterface[]=[]
  allLearners:LearnerInterface[]=[]
  selectedLearner:LearnerInterface={_id: "", certificates: [], courses: [], password: "", username: "Select Learner"}
  selectedFile: any;
  tempSdate:NgbDate={
    day: 1, month: 2, year: 2020, after(other?: NgbDateStruct | null): boolean {
      return false;
    }, before(other?: NgbDateStruct | null): boolean {
      return false;
    }, equals(other?: NgbDateStruct | null): boolean {
      return false;
    }
  };
  tempEdate:NgbDate={  day: 0, month: 0, year: 0, after(other?: NgbDateStruct | null): boolean {
      return false;
    }, before(other?: NgbDateStruct | null): boolean {
      return false;
    }, equals(other?: NgbDateStruct | null): boolean {
      return false;
    }
  };

  a1:Alert={type:"warning", message:"Already Enrolled!"}
  a1Show=false

  a2:Alert={type:"warning", message:"Already Completed This Course!"}
  a2Show=false

  a3:Alert={type:"warning", message:"Already done 3 attempts. Course Locked"}
  a3Show=false

  a4:Alert={type:"success", message:"Saved!"}
  a4Show=false

  a5:Alert={type:"success", message:"Image Uploaded!"}
  a5Show=false

  constructor(public activeModal: NgbActiveModal, private courseService:CoursesService, private learnerService:LearnerService) {}

  close(a:string) {
    if (a=="a1")
      this.a1Show=false
    if (a=="a2")
      this.a2Show=false
    if(a=="a3")
      this.a3Show=false
    if (a=="a4")
      this.a4Show=false
    if (a=="a5")
      this.a5Show=false
  }

  ngOnInit(): void {
    console.log("Course details modal opened")
    this.getAllAssessments();
    this.getAllMaterials();
    this.getCourseAssessments();
    this.getCourseMaterials();
    this.getEnrolledLearners();
    this.getAllLearners();

    let sJsDate=new Date(this.course.startDate*1000)
    let eJsDate=new Date(this.course.endDate*1000)
    console.log(this.course.startDate)
    console.log(sJsDate)
    console.log(sJsDate.getMonth())

    this.tempSdate={
      day: sJsDate.getDate(), month: sJsDate.getMonth()+1, year: sJsDate.getFullYear(), after(other?: NgbDateStruct | null): boolean {
        return false;
      }, before(other?: NgbDateStruct | null): boolean {
        return false;
      }, equals(other?: NgbDateStruct | null): boolean {
        return false;
      }
    };
    this.tempEdate={   day: eJsDate.getDate(), month: eJsDate.getMonth()+1, year: eJsDate.getFullYear(), after(other?: NgbDateStruct | null): boolean {
        return false;
      }, before(other?: NgbDateStruct | null): boolean {
        return false;
      }, equals(other?: NgbDateStruct | null): boolean {
        return false;
      }
    };

  }

  getCourseMaterials(){
    this.courseMaterials=[]
    for (let i=0; i<this.course.materials.length; i++){
      this.courseService.getMaterialInformation(this.course.materials[i])
        .subscribe((data:FolderInterface[])=>{
          this.courseMaterials.push(data[0].materials[0])
        })
    }
  }

  getCourseAssessments(){
    this.courseAssessments=[]
    for (let i=0; i<this.course.assessments.length; i++){
      this.courseService.getAssessmentInformation(this.course.assessments[i].assessmentID)
        .subscribe((data:AssessmentInterface[])=>{
          this.courseAssessments.push(data[0])
        })
    }
  }

  getAllAssessments(){
    this.allAssessments=[]
      this.courseService.getAllAssessments()
        .subscribe((data:AssessmentInterface[])=>{
          this.allAssessments=data;
        })
  }

  getAllMaterials(){
    this.allMaterials=[]
    this.courseService.getAllMaterials()
      .subscribe((data:FolderInterface[])=>{
        for (let i=0; i<data.length; i++){
          for (let j=0; j<data[i].materials.length; j++){
            this.allMaterials.push(data[i].materials[j])
          }
        }
      })
  }

  deleteMaterial(index:number):void{
    this.course.materials.splice(index,1)
    this.courseMaterials.splice(index,1)
  }

  addMaterial():void{
    this.course.materials.push(this.selectedMaterial._id)
    this.courseMaterials.push(this.selectedMaterial)
    this.selectedMaterial={_id: "", isDownloadable: false, name: "Choose Material", path: "", type: ""}
    this.newMaterial=false;
  }

  getNewMaterial():void{
    this.newMaterial=true
  }

  deleteAssessment(index:number):void{
    this.course.assessments.splice(index,1)
    this.courseAssessments.splice(index,1)
  }

  addAssessment(input:HTMLInputElement):void{
    let newA:AssessmentInCourse={
      assessmentID:this.selectedAssessment._id,
      weightage:parseInt(input.value)
    }
    this.course.assessments.push(newA)
    this.courseAssessments.push(this.selectedAssessment)
    this.selectedAssessment={
      _id: "", minPassing: 0, name: "Select Assessment", questions: [], time: 0
    }
    this.newAssessment=false;
  }

  getNewAssessment():void{
    this.newAssessment=true
  }

  updateCourse(date:string=""){
    console.log("updating course with id ", this.course._id)
    if (date=="dates"){
      const startJsDate = new Date(this.tempSdate.year, this.tempSdate.month - 1, this.tempSdate.day);
      const endJsDate=new Date(this.tempEdate.year, this.tempEdate.month - 1, this.tempEdate.day);
      console.log(startJsDate.getTime()/1000)
      this.course.startDate=startJsDate.getTime()/1000
      this.course.endDate=endJsDate.getTime()/1000
    }
    this.courseService.updateCourse(this.course).subscribe((res:any)=> {
      console.log(res)
      this.a4Show=true
    })
  }

  getEnrolledLearners(){
    this.courseService.getEnrolledInCourse(this.course._id).subscribe((data:CourseLearnerInterface[])=>{
      console.log(data)
      this.enrolledLearners=data[0].learnerDetails;
      console.log(this.enrolledLearners)
    })
  }

  removeLearner(index:number){

    let learner:any
    this.learnerService.getLearnerInformation(this.enrolledLearners[index]._id).subscribe((data:LearnerInterface[])=>{
      learner=data[0]
      for (let i=0; i<learner.courses.length; i++){
        if (learner.courses[i].courseId==this.course._id){
          learner.courses.splice(i, 1);
        }
      }
      this.learnerService.updateLearner(learner).subscribe((res:any)=> {
        console.log(res)
        this.enrolledLearners.splice(index, 1);
        this.getAllLearners()
      })
    })

  }

  getAllLearners(){
    this.allAssessments=[]
    this.learnerService.getAllLearners()
      .subscribe((data:LearnerInterface[])=>{
        this.allLearners=data;
      })
  }

  getNewLearner(){
    this.newLearner=true;
  }

  addLearner(){
    let newCourse:CourseInLearner={assessmentsDone: [], attemptNo: 0, courseId: this.course._id, progress: 0, score: 0, status: "enrolled"};
    let found=false
    for (let i=0; i<this.selectedLearner.courses.length; i++){
      if (this.selectedLearner.courses[i].courseId==this.course._id){
        //already exists
        found=true
        if (this.selectedLearner.courses[i].status=="enrolled"){
          // window.alert("Already Enrolled!")
          this.a1Show=true
        }
        else if (this.selectedLearner.courses[i].status=="completed"){
          // window.alert("Already Completed This Course!")
          this.a2Show=true
        }
        else if (this.selectedLearner.courses[i].status=="failed"){
          if (this.selectedLearner.courses[i].attemptNo<3){
            this.selectedLearner.courses[i].status="enrolled";
            this.selectedLearner.courses[i].attemptNo+=1
            this.enrolledLearners.push(this.selectedLearner)
          }
          else{
            // window.alert("Already done 3 attempts. Course Locked")
            this.a3Show=true
          }
        }
      }
    }
    if (!found){
      this.selectedLearner.courses.push(newCourse)
      this.enrolledLearners.push(this.selectedLearner)
    }

    this.learnerService.updateLearner(this.selectedLearner).subscribe((res:any)=> {
      console.log(res)
      this.getAllLearners()
      this.newLearner=false
      this.selectedLearner={_id: "", certificates: [], courses: [], password: "", username: "Select Learner"}
    })


  }

  getLearnerProgress(id:string):any{
   for (let i=0; i<this.allLearners.length; i++){
     if (this.allLearners[i]._id==id){ //got learner
       for (let j=0; j<this.allLearners[i].courses.length; j++){
         if (this.allLearners[i].courses[j].courseId==this.course._id){
           return this.allLearners[i].courses[j].progress
         }
       }
     }
   }
  }

  fileChosen(event: any){
    this.selectedFile=event.target.files[0];
  }

  uploadImage(){
    //if called then call the uploading thing and when that is done, then change path of
    //course.image to the new one

    this.courseService.uploadImage(this.selectedFile).subscribe((data:any)=>{
      console.log("Image Uploaded")
      this.course.image=this.selectedFile.name;
      this.a5Show=true;
    })
  }





}
