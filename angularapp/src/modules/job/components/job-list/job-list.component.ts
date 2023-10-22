import { Component, OnDestroy, OnInit } from '@angular/core';
import { FetchService } from '../../../../services/fetch-service';
import { JobResponse } from '../../../../models/job.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit, OnDestroy {

  jobs: JobResponse[] = [];
  onDestroy$ = new Subject();
  constructor(private fetchService: FetchService) { }

  ngOnInit(): void {
    this.fetchService.getJobs()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((jobs) => {
        this.jobs = jobs;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }
}
