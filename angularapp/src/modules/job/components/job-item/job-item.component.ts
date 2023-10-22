import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy } from '@angular/core';
import { JobResponse } from '../../../../models/job.model';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { SignalrService, StateResponse } from '../../../../services/signalr-service';
import { JobState } from '../../../../models/enum/JobStatus';

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.css'],
})
export class JobItemComponent implements OnDestroy {
  @Input() job?: JobResponse;

  stepsExpanded: boolean = false;

  onDestroy$ = new Subject();

  constructor(private jobHub: SignalrService, private cdr: ChangeDetectorRef, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.jobHub.jobCompletion$.pipe(takeUntil(this.onDestroy$),
      filter(Boolean)
    )
      .subscribe((stateResponse: StateResponse) => {
        if (this.job && this.job.id == stateResponse?.id)
          this.job.state = stateResponse?.state || 0;
        this.cdr.detectChanges();
      }
      );
  }
  toggleSteps() {
    this.stepsExpanded = !this.stepsExpanded;
    if (this.stepsExpanded) {
      this.elementRef.nativeElement.classList.add('expanded');
    } else {
      this.elementRef.nativeElement.classList.remove('expanded');
    }
  }

  stopJob() { }

  canStop(): boolean {
    return this.job?.state == JobState.InProgress;
  }

  get jobsButtonText() {
    if (this.stepsExpanded) {
      return 'Hide Steps';
    }
    else {
      return 'Show Steps';
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }
}
