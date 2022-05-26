import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LearnerInterface} from "../interfaces/LearnerInterface";

@Injectable({
  providedIn: 'root'
})
export class LearnerService {

  constructor(private http:HttpClient) { }

  getAllLearners(){
    return this.http.get<LearnerInterface[]>("http://localhost:3000/admin/allLearners");
  }

  updateLearner(l:LearnerInterface){
    return this.http.post("http://localhost:3000/admin/updateLearner", l);
  }
}
