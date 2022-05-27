import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LearnerInterface} from "../interfaces/LearnerInterface";
import {AssessmentInterface} from "../interfaces/AssessmentInterface";

@Injectable({
  providedIn: 'root'
})
export class LearnerService {

  constructor(private http:HttpClient) { }

  getAllLearners(){
    return this.http.get<LearnerInterface[]>("http://localhost:3000/admin/allLearners");
  }

  getLearnerInformation(id:string){
    return this.http.get<LearnerInterface[]>("http://localhost:3000/admin/getLearner/"+id);
  }

  updateLearner(l:LearnerInterface){
    return this.http.post("http://localhost:3000/admin/updateLearner", l);
  }
}
