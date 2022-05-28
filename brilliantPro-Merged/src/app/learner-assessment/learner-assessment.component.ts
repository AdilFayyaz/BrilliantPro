import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-learner-assessment',
  templateUrl: './learner-assessment.component.html',
  styleUrls: ['./learner-assessment.component.css'],
  providers: [NgbCarouselConfig]  // add NgbCarouselConfig to the component providers

})
export class LearnerAssessmentComponent implements OnInit {
  username:any=""
  images = [700, 533, 807, 124].map((n) => "https://picsum.photos/id/${n}/900/500");

  constructor(private route: ActivatedRoute,config: NgbCarouselConfig) {
    this.username=this.route.snapshot.paramMap.get('person');
  

    // customize default values of carousels used by this component tree
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }
  ngOnInit(): void {
  }

}
