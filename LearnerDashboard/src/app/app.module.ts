import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LearnerDasboardComponent } from './learner-dasboard/learner-dasboard.component';
import { CertificateComponent } from './certificate/certificate.component';
import { LearnerMaterialComponent } from './learner-material/learner-material.component';
import { CommonModule } from '@angular/common';
import { LearnerAssessmentComponent } from './learner-assessment/learner-assessment.component';


@NgModule({
  declarations: [
    AppComponent,
    LearnerDasboardComponent,
    CertificateComponent,
    LearnerMaterialComponent,
    LearnerAssessmentComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
