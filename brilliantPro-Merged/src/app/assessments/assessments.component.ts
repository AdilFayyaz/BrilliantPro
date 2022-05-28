import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AssessmentsService } from './assessments.service';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.css']
})
export class AssessmentsComponent implements OnInit {
  assessments: Assessment[] = [];
  editAssessmentTemp: Assessment;
  questionTemp: any;

  constructor(private assessmentsService: AssessmentsService) {
    this.editAssessmentTemp = new Assessment();
   }
 
   // assessment form
  assessmentForm = new FormGroup({
    assessment_name: new FormControl(''),
    assessment_minPassing: new FormControl(''),
    assessment_time: new FormControl(''),
  });

  // mcq form
  mcqForm = new FormGroup({
    question: new FormControl(''),
    option1: new FormControl(''),
    option2: new FormControl(''),
    option3: new FormControl(''),
    option4: new FormControl(''),
    correctAnswer: new FormControl(''),
    assessment_id: new FormControl(''),
  })

  // edit Assessment form
  editAssessmentForm = new FormGroup({
    assessment_name: new FormControl(''),
    assessment_minPassing: new FormControl(''),
    assessment_time: new FormControl(''),
  })

  // edit question form
  editQuesForm = new FormGroup({
    question: new FormControl(''),
    option1: new FormControl(''),
    option2: new FormControl(''),
    option3: new FormControl(''),
    option4: new FormControl(''),
    answer: new FormControl(''),
  })

  // add assessment
  addAssessment(){
    this.assessmentsService.addAssessment(this.assessmentForm.value).subscribe(
      (data) => {
        console.log(data);
        this.assessmentForm.reset();
        this.getAssessments(true);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  // get assessments
  getAssessments(byPass: boolean = false){
    if(this.assessments.length == 0 || byPass){
      this.assessmentsService.getAssessments().subscribe(
        (data) => {
          // console.log(data);
          this.assessments = data;
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  editAssessmentT(assessment: Assessment){
    this.editAssessmentTemp = assessment;
  }

  // editAssessment
  editAssessment(assessment: any){
    // send edited assessment to service
    if(this.editAssessmentTemp._id){
      this.assessmentsService.editAssessment(this.editAssessmentForm.value, this.editAssessmentTemp._id).subscribe(
        (data) => {
          console.log(data);
          this.assessments = [];
          this.getAssessments(true);
          this.editAssessmentForm.reset();
          this.editAssessmentTemp = new Assessment();
        }
      )
    }

  }

  // delete assessment
  deleteAssessment(assessment: Assessment){
    console.log(assessment)
    if(assessment._id){  
      console.log("deleting assessment")  
      this.assessmentsService.deleteAssessment(assessment._id).subscribe(
      (data) => {
        this.assessments = [];
        this.getAssessments(true);
      },
      (error) => {
        console.log(error);
      }  
    )}
  }

  
    onSubmitMCQ(){
      console.log(this.mcqForm.value);
      if(this.mcqForm.value.assessment_id){
        this.assessmentsService.addMCQToAssessment(this.mcqForm.value, this.mcqForm.value.assessment_id).subscribe(
          (data) => {
            console.log(data);
            this.assessments = [];
            this.mcqForm.reset();
            this.getAssessments(true);
          }
        )
      }

    }

    // delete a Question
    deleteQuestion(assessment: Assessment, question: any){
      console.log(question);
      if(assessment._id){
        this.assessmentsService.deleteMCQFromAssessment( question, assessment._id).subscribe(
          (data) => {
            console.log(data);
            this.assessments = [];
            this.getAssessments(true);
          }
        )
      }
    }

    // edit a Question
    editQuestion(assessment: Assessment, question: any){
      this.editAssessmentTemp = assessment;
      this.questionTemp = question;
    }
    

  onEditQuestionSubmit(){
    // console.log(this.editQuesForm.value)
    if(this.editAssessmentTemp._id){
      this.assessmentsService.editQuestion(this.editQuesForm.value, this.editAssessmentTemp._id, this.questionTemp).subscribe(
        (data) => {
          console.log(data);
          this.assessments = [];
          this.getAssessments(true);
          this.editQuesForm.reset();
          this.editAssessmentTemp = new Assessment();
        }
      )
    }

  }
  // on submit event
  onSubmit(){
    this.addAssessment();
  }
  ngOnInit(): void {
  }

}

class Assessment{
  _id: number|undefined;
  name: string | undefined;
  minPassing: number | undefined;
  time: number | undefined;
  questions: any[] | undefined;
}
