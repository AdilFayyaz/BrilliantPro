import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-learner-material',
  templateUrl: './learner-material.component.html',
  styleUrls: ['./learner-material.component.css']
})
export class LearnerMaterialComponent implements OnInit {
courseId:any;
assessments:any;
assessmentsDetails:any=[];
material:any;
username:any=""
allDoneAssessments:any=[]
isdisable:any=[]
constructor(private route: ActivatedRoute) {
  console.log("helooo")
  this.courseId=history.state.course.courseId
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
}
