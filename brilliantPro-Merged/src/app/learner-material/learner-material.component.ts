import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
completed=false;
failed=false;
numAttempts:number=0
constructor(private route: ActivatedRoute,private modalService: NgbModal) {
  console.log("helooo")
  this.courseId=history.state.course.courseId
  this.courseName=history.state.courseDetails.name
  this.assessments=history.state.courseDetails.assessments
  console.log("assesss",this.assessments)
  console.log("assesssment details",this.assessmentsDetails)
  this.username=this.route.snapshot.paramMap.get('person');
  this.getMaterial()
  this.getPassingScore()
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

  
      let finish=0
      for(let j=0;j<this.assessmentsDetails.length;j++){
        let check=false
        for(let i=0;i<this.allDoneAssessments.length;i++){

        // console.log("->",this.assessmentsDetails[j][0]._id)
           
        if(this.assessmentsDetails[j][0]._id==this.allDoneAssessments[i].assessmentID){
          console.log("already done!")
          finish++;
          this.isdisable.push({a:this.assessmentsDetails[j][0].name,val:true})
          check=true;
        }
     
        
       
      }
    if(check==false){
      this.isdisable.push({a:this.assessmentsDetails[j][0].name,val:false})
    }
    }
    console.log("after ",this.isdisable," ",finish ,"/",this.assessmentsDetails.length)
    let gainedTotal=0;
    if ((finish)==this.assessmentsDetails.length && this.assessmentsDetails.length!=0 ){
      console.log("the course has finished for this learner")
      for(let i=0;i<this.assessmentsDetails.length;i++){
        gainedTotal+=this.allDoneAssessments[i].gainedAbs
        console.log("gained total",gainedTotal," min pass",this.minPassingScore)

      }
      if(gainedTotal<this.minPassingScore){
        console.log("fail")
        let isdisabled2=[]
        for(let i=0;i<this.assessmentsDetails.length;i++){
        isdisabled2.push({a:this.assessmentsDetails[i][0].name,val:false})
       
        }

        this.isdisable=isdisabled2
        console.log("chng",this.isdisable, "attm",this.numAttempts)

        this.getCourseAttempts()
        var requestOptions = {}
        requestOptions={
          method: 'GET',
          redirect: 'follow'
        };
        
        fetch("http://127.0.0.1:3000/learner/courseAttempt/"+this.courseId+"/learner/"+this.username, requestOptions)
          .then(response => response.json())
          .then(result => {console.log("atmno",result.attemptNo)
          this.numAttempts=Number(result.attemptNo)
          
        // 
          if(this.numAttempts<3){
            this.numAttempts=this.numAttempts+1
            console.log("attm2",this.numAttempts)
            console.log("another attempt")
          this.setAnotherAttempt()
      
          }
          else{
            console.log("3 attempts gone")
            this.UpdateToStatus("failed")
            this.failed=true
          }
          // 
        })
        .catch(error => console.log('error', error));

      }
      else{
        console.log("pass")
        this.UpdateToStatus("completed")
        this.completed=true
      }
    }

    })
    .catch(error => console.log('error', error));
 }
 UpdateToStatus(stat:string){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  var raw = JSON.stringify({
    "status": stat,
    "courseId": this.courseId
  });
  
  var requestOptions = {}
  requestOptions={
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  fetch("http://127.0.0.1:3000/learner/setCourseStatus/hurriya1", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
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
        this.progress=Number( result.progress)
        return this.progress
      })
      .catch(error => console.log('error', error));
  }
  progressMap = new Map<string, number>();
  pdfsrc="../../assets/18I-0597.pdf"
  pdf=false;
  addProgress(name:any){
    this.pdf=true
  console.log(this.progressMap.get(name))
   if(this.progressMap.get(name)==undefined){
    let total=this.material.length
    this.progressMap.set(name, 100/total); 
    this.addProgressToDB(this.progressMap.get(name))
   }

  }
  perc:number=0
addProgressToDB(amount:any ){
  this.perc=<number>this.progress

 this.perc=this.perc+<number>(amount);
  console.log("progress current",typeof(this.progress)," ",this.perc)

    if(this.perc<=100){
      this.progress=this.perc

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


minPassingScore:number=0
getPassingScore():void{
  var requestOptions = {}
  requestOptions={
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("http://127.0.0.1:3000/learner/courseName/"+this.courseId, requestOptions)
    .then(response => response.json())
    .then(result =>{ console.log(result[0])
    this.minPassingScore= result[0].minPassScore
    })
    .catch(error => console.log('error', error));
}


getCourseAttempts(){
  var requestOptions = {}
  requestOptions={
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("http://127.0.0.1:3000/learner/courseAttempt/"+this.courseId+"/learner/"+this.username, requestOptions)
    .then(response => response.json())
    .then(result => {console.log("atmno",result.attemptNo)
    this.numAttempts=Number(result.attemptNo)
    })
    .catch(error => console.log('error', error));
}

setAnotherAttempt(){
  // this.numAttempts= this.numAttempts+1
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");

var raw = "{}";

var requestOptions = {}
requestOptions={
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://127.0.0.1:3000/learner/UpdateAssignmentsReattempt/"+this.courseId+"/learner/"+this.username, requestOptions)
  .then(response => response.text())
  .then(result => {console.log(result)
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      var raw = JSON.stringify({
        "courseId": this.courseId,
        "attemptNo": this.numAttempts
      });
      
      var requestOptions = {}
      requestOptions={
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("http://127.0.0.1:3000/learner/setCourseAttempt/"+this.username, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    
    
  })
  .catch(error => console.log('error', error)); // assigns empty array to assessmentDone

 
}


// modal
closeResult = '';

open(content: any) {
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}


}
