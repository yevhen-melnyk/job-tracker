// service to get all jobs from the endpoint

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobResponse } from '../models/job.model';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
constructor(private http: HttpClient) { }

  getJobs(): Observable<JobResponse[]> {
    return this.http.get<JobResponse[]>(environment.apiUrl + '/jobs');
  }
}
