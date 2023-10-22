import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { StepResponse } from '../../../../models/step.model';
import { SignalrService, StateResponse } from '../../../../services/signalr-service';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-step-item',
  templateUrl: './job-step-item.component.html',
  styleUrls: ['./job-step-item.component.css']
})
export class JobStepItemComponent {
  @Input() step?: StepResponse;
  onDestroy$ = new Subject();

  constructor(private jobHub: SignalrService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.jobHub.stepCompletion$.pipe(takeUntil(this.onDestroy$),
      filter(Boolean)
    )
      .subscribe((stateResponse: StateResponse) => {
        if (this.step && this.step.id == stateResponse?.id)
          this.step.state = stateResponse?.state || 0;
        this.cdr.detectChanges();
      }
      );
  }


  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }


}
