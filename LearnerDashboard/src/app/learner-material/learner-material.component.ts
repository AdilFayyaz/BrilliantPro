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
constructor(private route: ActivatedRoute) {
  this.courseId=history.state.course.courseId
  this.assessments=history.state.courseDetails.assessments
  console.log("assesss",this.assessments)
  this.username=this.route.snapshot.paramMap.get('person');
  this.getMaterial()
 for(let i=0;i<this.assessments.length;i++){
  this.getAssessments(this.assessments[i].assessmentID)
 }
  }

  ngOnInit(): void {
  }
 getMaterial(){

    var requestOptions = {}
    requestOptions={
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("http://127.0.0.1:3000/courseMaterial/"+this.courseId, requestOptions)
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
  
  fetch("http://127.0.0.1:3000/getAssessment/"+id, requestOptions)
    .then(response => response.json())
    .then(result => {console.log(result)
    this.assessmentsDetails.push(result)
    })
    .catch(error => console.log('error', error));
 }
}
