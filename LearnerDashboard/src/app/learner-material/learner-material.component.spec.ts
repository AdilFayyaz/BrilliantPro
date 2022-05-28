import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerMaterialComponent } from './learner-material.component';

describe('LearnerMaterialComponent', () => {
  let component: LearnerMaterialComponent;
  let fixture: ComponentFixture<LearnerMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnerMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
