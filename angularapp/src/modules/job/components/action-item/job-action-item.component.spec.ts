import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionItemComponent } from './job-action-item.component';

describe('JobActionItemComponent', () => {
  let component: JobActionItemComponent;
  let fixture: ComponentFixture<JobActionItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobActionItemComponent]
    });
    fixture = TestBed.createComponent(JobActionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
