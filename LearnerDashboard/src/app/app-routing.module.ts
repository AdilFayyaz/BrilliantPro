import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertificateComponent } from './certificate/certificate.component';
import { LearnerDasboardComponent } from './learner-dasboard/learner-dasboard.component';

const routes: Routes = [ 
  {path: 'certificate/:person', component: CertificateComponent},
{path: '', component: LearnerDasboardComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
