import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-learner-assessment',
  templateUrl: './learner-assessment.component.html',
  styleUrls: ['./learner-assessment.component.css'],
  providers: [NgbCarouselConfig]  // add NgbCarouselConfig to the component providers

})
export class LearnerAssessmentComponent implements OnInit {
  username:any=""
assessments:any=[];
weightage:number=0;
time:number=0;
minPassing:number=0;
istimeUp:boolean=false;
istimeUp2:boolean=false;
correctCount:number=0;
incorrectCount:number=0;
courseId:number=0;
 map = new Map<string, string>();

  constructor(private route: ActivatedRoute,config: NgbCarouselConfig) {
    this.username=this.route.snapshot.paramMap.get('person');
    this.assessments=history.state.assessments
    this.time=this.assessments.time*60;
    this.minPassing=this.assessments.minPassing;
    this.weightage=history.state.weightage
    this.courseId=history.state.courseId
    console.log("assessments received ",this.assessments)

    // customize default values of carousels used by this component tree
    config.interval = 0;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;


  }
  templateForm(q:any,value: any) {
    // alert(q+"-"+(value));
    this.map.set(q, value); 
  }
  ngOnInit(): void {
  }
  timeUp():void{
    // console.log("timeee uppp")
    // this.istimeUp=true;
    // console.log("mapp",this.map)
    // for(let i=0;i<this.assessments.questions.length;i++){
    //   console.log(this.assessments.questions[i].answer,"-> ",this.map.get(this.assessments.questions[i].question))
    //   if(this.assessments.questions[i].answer==this.map.get(this.assessments.questions[i].question)){
    //       this.correctCount++;
    //   }
    //   else{
    //     this.incorrectCount++;
    //   }
    // }

  }
  score:number=0;
  weightedScore:number=0;
  passValue=false;
  passValueStr="";
  questionSummary="";
  grade="";
  testFinish():void{
    this.istimeUp=true;
    console.log("mapp",this.map)
    for(let i=0;i<this.assessments.questions.length;i++){
      console.log(this.assessments.questions[i].answer,"-> ",this.map.get(this.assessments.questions[i].question))
      if(this.assessments.questions[i].answer==this.map.get(this.assessments.questions[i].question)){
          this.correctCount++;
          this.questionSummary=this.questionSummary+"\nQuestion# "+(i+1)+" Correct"
      }
      else{
        this.incorrectCount++;
        this.questionSummary=this.questionSummary+"\nQuestion# "+(i+1)+" InCorrect(Answer: "+this.assessments.questions[i].answer+" , YourAnswer: "+this.map.get(this.assessments.questions[i].question)+")"
      }
    
      

    }
    this.score=(this.correctCount/this.assessments.questions.length)*100
    this.weightedScore=(this.weightage*this.correctCount)/this.assessments.questions.length

    if(this.weightedScore>=this.minPassing){
        this.passValue=true;
        this.passValueStr="Pass"
    }
    else{
      this.passValue=false
      this.passValueStr="Fail"

    }

    if(this.score==100 && this.score>80){
        this.grade="A"
    }
    else if(this.score<=80 && this.score>70){
      this.grade="B"
    }
    else if(this.score<=70 && this.score>60){
      this.grade="C"
    }
    else if(this.score<=60 && this.score>50){
      this.grade="D"
    }
    else if(this.score<=50 && this.score>30){
      this.grade="E"
    }
    else{
      this.grade="F"
    }
    this.updateDB()
  }
  updateDB():void{
    console.log("name ",this.username)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "done": {
        "assessmentID":this.assessments._id,
        "grade": this.grade,
        "passValue": this.passValue,
        "quesSummary": this.questionSummary,
        "correctQ": this.correctCount,
        "incorrectQ": this.incorrectCount,
        "gainedAbs":this.weightedScore
      }
    });
    
    var requestOptions = {}
    requestOptions={
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://127.0.0.1:3000/learner/UpdateAssignmentsDone/"+this.courseId+"/learner/"+this.username, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('errror', error));
  }
}
