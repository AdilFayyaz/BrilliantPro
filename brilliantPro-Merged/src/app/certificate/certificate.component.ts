import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  name:any=""
  course:any=[]
  courseName:any=""
  courseStart:any=""
  courseEnd:any=""
  constructor(private route: ActivatedRoute) {
    console.log("name=",history.state.course,"ooo",this.route.snapshot.paramMap.get('person'))
    this.name=this.route.snapshot.paramMap.get('person')
    this.course=history.state.course
    this.courseName=history.state.courseName
    this.courseStart=history.state.courseStart
    this.courseEnd=history.state.courseEnd
    // ," course",this.course)
   }

  ngOnInit(): void {
  }

}
