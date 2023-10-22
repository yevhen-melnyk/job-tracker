import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInputComponent } from './job-input.component';

describe('JobInputComponent', () => {
  let component: JobInputComponent;
  let fixture: ComponentFixture<JobInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobInputComponent]
    });
    fixture = TestBed.createComponent(JobInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
