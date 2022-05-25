import { Component, OnInit } from '@angular/core';
import {CoursesService} from "../courses.service";
import {CoursesInterface} from "../coursesInterface";
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  active="top"
  animation=true;
  learners=0;
  enrolled=0;
  materials=0;
  certificates=0;
  selected:any
  courses:any[]=[]

  passed=0;
  failed=0;
  enrolledC=0;
  midway=0;
  started=0;

  constructor(private courseService:CoursesService) {
      monkeyPatchChartJsTooltip();
      monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    this.fetchNumLearners()
    this.fetchNumCertificates()
    this.fetchNumEnrolled()
    this.fetchNumMaterials()
    this.fetchAllCourses()


  }

  fetchNumLearners(){
    this.courseService.getLearnersCount()
      .subscribe((data:string)=>this.learners=parseInt(data))
  }

  fetchNumEnrolled(){
    this.courseService.getEnrolledCoursesCount()
      .subscribe((data:string)=>this.enrolled=parseInt(data))
  }

  fetchNumCertificates(){
    this.courseService.getCertificatesCount()
      .subscribe((data:string)=>this.certificates=parseInt(data))
  }

  fetchNumMaterials(){
    this.courseService.getMaterialsCount()
      .subscribe((data:string)=>this.materials=parseInt(data))
  }

  fetchAllCourses(){
    this.courseService.getAllCourses()
      .subscribe((data:CoursesInterface[])=>{
        for (var i=0; i<data.length; i++){
          this.courses.push(data[i])
        }
        this.selected=data[0]
        console.log(this.courses)
        console.log(this.selected)

        this.getEnrolledInCourse(this.selected._id);
        this.getFailedInCourse(this.selected._id);
        this.getPassedInCourse(this.selected._id);
        this.getMidwayInCourse(this.selected._id);
        this.getStartersInCourse(this.selected._id);

        console.log(this.pieChartData)
      })
  }

  getEnrolledInCourse(id:string){
    this.courseService.getEnrolledInCourse(id)
      .subscribe((data:any[])=>{
        console.log(data[0].learnerDetails.length)
        this.enrolledC=data[0].learnerDetails.length;
        this.pieChartData = [this.enrolledC, this.passed, this.failed];
      })
  }

  getPassedInCourse(id:string){
    this.courseService.getPassedInCourse(id)
      .subscribe((data:any[])=>{
        console.log(data[0].learnerDetails.length)
        this.passed=data[0].learnerDetails.length;

        this.pieChartData = [this.enrolledC, this.passed, this.failed];
      })
  }

  getFailedInCourse(id:string){
    this.courseService.getFailedInCourse(id)
      .subscribe((data:any[])=>{
        console.log(data[0].learnerDetails.length)
        this.failed=data[0].learnerDetails.length;

        this.pieChartData = [this.enrolledC, this.passed, this.failed];
      })
  }

  getStartersInCourse(id:string){
    this.courseService.getStartersInCourse(id)
      .subscribe((data:any[])=>{
        console.log(data[0].learnerDetails.length)
        this.started=data[0].learnerDetails.length;
        this.barChartData=[this.started, this.midway];
      })
  }

  getMidwayInCourse(id:string){
    this.courseService.getMidwayInCourse(id)
      .subscribe((data:any[])=>{
        console.log(data[0].learnerDetails.length)
        this.midway=data[0].learnerDetails.length;
        this.barChartData=[this.started, this.failed];
      })
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Enrolled'], ['Passed'], ['Failed']];
  public pieChartData: SingleDataSet = [1, 1, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [['Started'], ['Past Midway']];
  public barChartData: SingleDataSet = [1, 1];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];



}
