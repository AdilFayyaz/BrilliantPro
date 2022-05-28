import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertificateComponent } from './certificate/certificate.component';
import { LearnerAssessmentComponent } from './learner-assessment/learner-assessment.component';
import { LearnerDasboardComponent } from './learner-dasboard/learner-dasboard.component';
import { LearnerMaterialComponent } from './learner-material/learner-material.component';

const routes: Routes = [ 
  {path: 'certificate/:person', component: CertificateComponent},
{path: '', component: LearnerDasboardComponent},
{path: 'material/:person', component: LearnerMaterialComponent},
{path: 'material/:person/assessment', component: LearnerAssessmentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
