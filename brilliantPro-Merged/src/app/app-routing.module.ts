import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {CourseComponent} from "./course/course.component";
import {LearnerComponent} from "./learner/learner.component";
import { LearnerDashboardComponent } from './learner-dashboard/learner-dashboard.component';
import { LearnerMaterialComponent } from './learner-material/learner-material.component';
import { LearnerAssessmentComponent } from './learner-assessment/learner-assessment.component';
import { CertificateComponent } from './certificate/certificate.component';

const routes:Routes=[
  {path:'dashboard', component:AdminDashboardComponent},
  {path:'course', component:CourseComponent},
  {path: 'learner', component:LearnerComponent},
  {path: 'learnerDashboard', component:LearnerDashboardComponent},
  {path: 'learnerDashboard/material/:person', component: LearnerMaterialComponent , pathMatch: 'full'},
  {path: 'learnerDashboard/certificate/:person', component: CertificateComponent , pathMatch: 'full'},
  {path: 'learnerDashboard/material/:person/assessment', component: LearnerAssessmentComponent , pathMatch: 'full'},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }