import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CountUpModule } from 'ngx-countup';
import { AppComponent } from './app.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from "@angular/common/http";
import {ChartsModule} from 'ng2-charts';
import { CourseComponent } from './course/course.component';
import { AppRoutingModule } from './app-routing.module';
import { LearnerComponent } from './learner/learner.component';
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    CourseComponent,
    LearnerComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgbModule,
    CountUpModule,
    HttpClientModule,
    ChartsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
