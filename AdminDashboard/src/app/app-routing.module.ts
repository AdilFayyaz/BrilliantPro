import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {CourseComponent} from "./course/course.component";
import {LearnerComponent} from "./learner/learner.component";

const routes:Routes=[
  {path:'dashboard', component:AdminDashboardComponent},
  {path:'course', component:CourseComponent},
  {path: 'learner', component:LearnerComponent},
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
