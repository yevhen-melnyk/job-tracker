import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobStepItemComponent } from './job-step-item.component';

describe('JobStepItemComponent', () => {
  let component: JobStepItemComponent;
  let fixture: ComponentFixture<JobStepItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobStepItemComponent]
    });
    fixture = TestBed.createComponent(JobStepItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
