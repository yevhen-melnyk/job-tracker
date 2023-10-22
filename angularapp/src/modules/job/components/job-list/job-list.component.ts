import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api-service';
import { JobResponse } from '../../../../models/job.model';
import { Subject, filter, takeUntil } from 'rxjs';
import { SignalrService } from '../../../../services/signalr-service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit, OnDestroy {

  jobs: JobResponse[] = [];
  onDestroy$ = new Subject();
  constructor(private fetchService: ApiService, private jobHub: SignalrService) { }

  ngOnInit(): void {
    this.fetchService.getJobs()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((jobs) => {
        this.jobs = jobs;
      });

    this.jobHub.jobAdded$.pipe(takeUntil(this.onDestroy$),
      filter(Boolean)
    )
      .subscribe((job: JobResponse) => {
        if (!this.jobs.some(j => j.id === job.id)) {
          this.jobs.push(job);
        }
      }
      );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }
}
