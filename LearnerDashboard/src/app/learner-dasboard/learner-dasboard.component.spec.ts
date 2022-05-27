import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerDasboardComponent } from './learner-dasboard.component';

describe('LearnerDasboardComponent', () => {
  let component: LearnerDasboardComponent;
  let fixture: ComponentFixture<LearnerDasboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnerDasboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerDasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
