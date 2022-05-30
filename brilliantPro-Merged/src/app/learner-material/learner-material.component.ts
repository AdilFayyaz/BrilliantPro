import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Double } from 'mongodb';

@Component({
  selector: 'app-learner-material',
  templateUrl: './learner-material.component.html',
  styleUrls: ['./learner-material.component.css']
})
export class LearnerMaterialComponent implements OnInit {
courseId:any;
courseName:any;
assessments:any;
assessmentsDetails:any=[];
material:any;
username:any=""
allDoneAssessments:any=[]
isdisable:any=[]
progress:number=0;
constructor(private route: ActivatedRoute) {
  console.log("helooo")
  this.courseId=history.state.course.courseId
  this.courseName=history.state.courseDetails.name
  this.assessments=history.state.courseDetails.assessments
  console.log("assesss",this.assessments)
  console.log("assesssment details",this.assessmentsDetails)
  this.username=this.route.snapshot.paramMap.get('person');
  this.getMaterial()
  for(let i=0;i<this.assessments.length;i++){
    this.getAssessments(this.assessments[i].assessmentID)
  }
  this.getDoneAssignments()
  // this.isdisable.apply(null, Array(this.assessmentsDetails.length)).map(function (x: any, i: any) { return false; })
  // .apply(false, Array(this.assessmentsDetails.length))
  this.getProgressFromDB()
 console.log("sendinggg ",this.assessments)
  }

  ngOnInit(): void {
  }
 getMaterial(){

    var requestOptions = {}
    requestOptions={
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("http://127.0.0.1:3000/learner/courseMaterial/"+this.courseId, requestOptions)
      .then(response => response.json())
      .then(result => {
      this.material=result
      console.log("material",JSON.stringify(this.material))})
      .catch(error => console.log('error', error));
 }
 getAssessments(id:any){
  var requestOptions = {}
  requestOptions={
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("http://127.0.0.1:3000/learner/getAssessment/"+id, requestOptions)
    .then(response => response.json())
    .then(result => {console.log(result)
    this.assessmentsDetails.push(result)
    })
    .catch(error => console.log('eror', error));
 }
 getDoneAssignments():void{
  var requestOptions = {}
  requestOptions={
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("http://127.0.0.1:3000/learner/getAssignmentsDone/"+this.courseId+"/learner/"+this.username, requestOptions)
    .then(response => response.json())
    .then(result => {console.log("alll done assigns ",result)
    this.allDoneAssessments=result

  
      // this.allDoneAssessments[i].assessmentID
      // console.log("length",this.assessmentsDetails[0])
      for(let j=0;j<this.assessmentsDetails.length;j++){
        let check=false
        for(let i=0;i<this.allDoneAssessments.length;i++){

        // console.log("->",this.assessmentsDetails[j][0]._id)
           
        if(this.assessmentsDetails[j][0]._id==this.allDoneAssessments[i].assessmentID){
          console.log("already done!")
          // this.assessmentsDetails.splice(j,1)
          this.isdisable.push({a:this.assessmentsDetails[j][0].name,val:true})
          check=true;
        }
     
        
       
      }
    if(check==false){
      this.isdisable.push({a:this.assessmentsDetails[j][0].name,val:false})
    }
    }
    console.log("after ",this.isdisable)

    })
    .catch(error => console.log('error', error));
 }
 getProgress():any{
   return this.progress
 }
  // get progress
  getProgressFromDB():any{
    var requestOptions = {}
    requestOptions={
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("http://127.0.0.1:3000/learner/courseProgress/"+this.courseId+"/learner/"+this.username, requestOptions)
      .then(response => response.json())
      .then(result => {console.log(result)
        console.log("data0",typeof(this.progress))
        this.progress=Number( result.progress)
        console.log("data1",typeof(this.progress))
        return this.progress
      })
      .catch(error => console.log('error', error));
  }
  progressMap = new Map<string, number>();
  addProgress(name:any){
  console.log(this.progressMap.get(name))
   if(this.progressMap.get(name)==undefined){
    let total=this.material.length
    this.progressMap.set(name, 100/total); 
    this.addProgressToDB(this.progressMap.get(name))
   }

  }
  perc:number=0
addProgressToDB(amount:any ){
  console.log("data2",typeof(this.progress))
  this.perc=<number>this.progress

 this.perc=this.perc+<number>(amount);
 this.progress=this.perc
  console.log("progress current",typeof(this.progress)," ",this.progress)
  var requestOptions = {}
  requestOptions={
    method: 'POST',
    redirect: 'follow'
  };
  
  fetch("http://127.0.0.1:3000/learner/UpdateCourseProgress/"+this.courseId+"/learner/"+this.username+"/progress/"+this.progress, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  
}
}
