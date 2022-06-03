import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CountUpModule } from 'ngx-countup';
import { AppComponent } from './app.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import {AddCourseComponent} from "./add-course/add-course.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from "@angular/common/http";
import {ChartsModule} from 'ng2-charts';
import { CourseComponent } from './course/course.component';
import { AppRoutingModule } from './app-routing.module';
import { LearnerComponent } from './learner/learner.component';
import {CommonModule} from "@angular/common";
import { CourseDetailsComponent } from './course-details/course-details.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LearnerDashboardComponent } from './learner-dashboard/learner-dashboard.component';
import { LearnerMaterialComponent } from './learner-material/learner-material.component';
import { LearnerAssessmentComponent } from './learner-assessment/learner-assessment.component';
import { CertificateComponent } from './certificate/certificate.component';
import { CdTimerModule } from 'angular-cd-timer';
import {AssessmentsComponent} from "./assessments/assessments.component";
import {LoginComponent} from "./login/login.component";
import {MaterialsManagementComponent} from "./materials-management/materials-management.component";
import {MDBBootstrapModule} from "angular-bootstrap-md";
import {MatIconModule} from "@angular/material/icon";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { NgxPaypalComponent, NgxPayPalModule } from "ngx-paypal";
import {PaymentComponent} from "./payment/payment.component";
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    CourseComponent,
    LearnerComponent,
    CourseDetailsComponent,
    LearnerDashboardComponent,
    LearnerMaterialComponent,
    LearnerAssessmentComponent,
    CertificateComponent,
    AddCourseComponent,
    AssessmentsComponent,
    MaterialsManagementComponent,
    LoginComponent,
    PaymentComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgbModule,
    CountUpModule,
    HttpClientModule,
    ChartsModule,
    FormsModule,
    AppRoutingModule,
    CdTimerModule,
    MDBBootstrapModule,
    ReactiveFormsModule,
    MatIconModule,
    MdbTabsModule,
    BrowserAnimationsModule,
    NgxPayPalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
