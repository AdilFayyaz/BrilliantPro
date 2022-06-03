import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
  assessmentForm = new UntypedFormGroup({
    assessment_name: new UntypedFormControl(''),
    assessment_minPassing: new UntypedFormControl(''),
    assessment_time: new UntypedFormControl(''),
  });

  // mcq form
  mcqForm = new UntypedFormGroup({
    question: new UntypedFormControl(''),
    option1: new UntypedFormControl(''),
    option2: new UntypedFormControl(''),
    option3: new UntypedFormControl(''),
    option4: new UntypedFormControl(''),
    correctAnswer: new UntypedFormControl(''),
    assessment_id: new UntypedFormControl(''),
  })

  // edit Assessment form
  editAssessmentForm = new UntypedFormGroup({
    assessment_name: new UntypedFormControl(''),
    assessment_minPassing: new UntypedFormControl(''),
    assessment_time: new UntypedFormControl(''),
  })

  // edit question form
  editQuesForm = new UntypedFormGroup({
    question: new UntypedFormControl(''),
    option1: new UntypedFormControl(''),
    option2: new UntypedFormControl(''),
    option3: new UntypedFormControl(''),
    option4: new UntypedFormControl(''),
    answer: new UntypedFormControl(''),
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
