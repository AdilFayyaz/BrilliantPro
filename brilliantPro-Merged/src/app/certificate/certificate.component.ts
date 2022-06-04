import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var require: any;

// import * as jspdf from 'jspdf';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

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

  public captureScreen()  
  {  
    var data = document.getElementById('contentToConvert') as HTMLCanvasElement;;  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save(this.courseName+'Certificate.pdf'); // Generated PDF   
    });  
  }  
  
}
