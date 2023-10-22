import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActionResponse } from '../../../../models/action.model';
import { SignalrService, StateResponse } from '../../../../services/signalr-service';
import { Subject, filter, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-action-item',
  templateUrl: './job-action-item.component.html',
  styleUrls: ['./job-action-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobActionItemComponent implements OnInit, OnDestroy {
  @Input() action?: ActionResponse;

  onDestroy$ = new Subject();

  constructor(private jobHub: SignalrService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.jobHub.allProgress$.pipe(takeUntil(this.onDestroy$),
      map(all => all.find(p => p.actionId == this.action?.id) || null ),
      filter(p => !!p)
    )
      .subscribe(progress => {
        if (progress && this.action) {
          this.action.progress = progress;
          this.cdr.detectChanges();
        }
      }
    );

    this.jobHub.actionCompletion$.pipe(takeUntil(this.onDestroy$),
      filter(a => a?.id == this.action?.id)
    )
      .subscribe((stateResponse: StateResponse) => {
        if (this.action)
        this.action.state = stateResponse?.state || 0;
      }
      );
  }

  get duration(): string {
    return this.action ? this.action.timeConsume : '';
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

}
