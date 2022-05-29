import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDate, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {CoursesService} from "../services/courses.service";
import {LearnerService} from "../services/learner.service";
import {CourseDBInterface} from "../interfaces/CourseDBInterface";
interface Alert{
  type:string,
  message:string;
}
@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  @Input() courses: any;
course: CourseDBInterface={
  _id: "",
  assessments: [],
  endDate: 0,
  enrollmentLink: "",
  image: "",
  materials: [],
  minPassScore: 0,
  name: "",
  overview: "",
  startDate: 0
}
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
  a4:Alert={type:"success", message:"Saved!"}
  a4Show=false

  a5:Alert={type:"success", message:"Image Uploaded!"}
  a5Show=false
  constructor(public activeModal: NgbActiveModal, private courseService:CoursesService, private learnerService:LearnerService) { }

  ngOnInit(): void {
    let today = new Date();
    this.tempSdate={
      day: today.getDate(), month: today.getMonth()+1, year: today.getFullYear(), after(other?: NgbDateStruct | null): boolean {
        return false;
      }, before(other?: NgbDateStruct | null): boolean {
        return false;
      }, equals(other?: NgbDateStruct | null): boolean {
        return false;
      }
    };
    this.tempEdate={   day: today.getDate()+1, month: today.getMonth()+1, year: today.getFullYear(), after(other?: NgbDateStruct | null): boolean {
        return false;
      }, before(other?: NgbDateStruct | null): boolean {
        return false;
      }, equals(other?: NgbDateStruct | null): boolean {
        return false;
      }
    };
  }

  close(a:string) {
    if (a=="a4")
      this.a4Show=false
    if (a=="a5")
      this.a5Show=false
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

  saveNewCourse(){
    const startJsDate = new Date(this.tempSdate.year, this.tempSdate.month - 1, this.tempSdate.day);
    const endJsDate=new Date(this.tempEdate.year, this.tempEdate.month - 1, this.tempEdate.day);
    console.log(startJsDate.getTime()/1000)
    this.course.startDate=startJsDate.getTime()/1000
    this.course.endDate=endJsDate.getTime()/1000
    this.courseService.newCourse(this.course).subscribe(
      (data:any)=> {
        console.log(data)
        let newCourse:CourseDBInterface={
          _id: data.insertedId,
          assessments: [],
          endDate: this.course.endDate,
          enrollmentLink: "http://localhost:4200/payment/courseid:"+data.insertedId+"/amount:"+this.course.enrollmentLink,
          image: this.course.image,
          materials: [],
          minPassScore: this.course.minPassScore,
          name: this.course.name,
          overview: this.course.overview,
          startDate: this.course.startDate
        }
        this.courses.push(newCourse)
      })
    }

}
