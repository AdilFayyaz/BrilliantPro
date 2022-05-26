import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LearnerDasboardComponent } from './learner-dasboard/learner-dasboard.component';
import { CertificateComponent } from './certificate/certificate.component';

@NgModule({
  declarations: [
    AppComponent,
    LearnerDasboardComponent,
    CertificateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
