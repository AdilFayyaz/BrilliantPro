import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssessmentsService {

  constructor(private httpclient: HttpClient) { }
  getAssessments(): Observable<any>{
    return this.httpclient.get('http://localhost:3000/getAllAssessments');
  }
  addAssessment(assessment: any): Observable<any>{
    return this.httpclient.post('http://localhost:3000/addAssessment', assessment);
  }
  //delete assessment
  deleteAssessment(id: number): Observable<any>{
    return this.httpclient.post('http://localhost:3000/deleteAssessment?id='+ id, {});
  }
  //add MCQ to Assessment
  addMCQToAssessment(mcq: any, assessmentId: number): Observable<any>{
    return this.httpclient.post('http://localhost:3000/addMCQToAssessment?id='+assessmentId, mcq);
  }
  // delete MCQ from Assessment
  deleteMCQFromAssessment(mcqQ: any, assessmentId: number): Observable<any>{
    return this.httpclient.post('http://localhost:3000/deleteMCQFromAssessment?assessmentId='+assessmentId, mcqQ);
  }
  // edit Assessment
  editAssessment(assessment: any, id: number): Observable<any>{
    console.log(assessment)
    return this.httpclient.post('http://localhost:3000/editAssessment?id='+id, assessment);
  }
  // edit Question
  editQuestion(formQ: any,assessmentId: number,  questionP: any): Observable<any>{
    var finalObj = {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "",
    }
  
    if(formQ.question){finalObj.question = formQ.question}
    else{finalObj.question = questionP.question}
    if(formQ.option1){finalObj.option1 = formQ.option1}
    else{finalObj.option1 = questionP.option1}
    if(formQ.option2){finalObj.option2 = formQ.option2}
    else{finalObj.option2 = questionP.option2}
    if(formQ.option3){finalObj.option3 = formQ.option3}
    else{finalObj.option3 = questionP.option3}
    if(formQ.option4){finalObj.option4 = formQ.option4}
    else{finalObj.option4 = questionP.option4}
    if(formQ.answer){finalObj.answer = formQ.answer}
    else{finalObj.answer = questionP.answer}
    return this.httpclient.post('http://localhost:3000/editQuestion?assessmentId='+assessmentId+"&questionP="+JSON.stringify(questionP), finalObj);
  }
}
