import { Component, HostListener } from '@angular/core';
import { SampleJob } from './SampleJob';
import { ApiService } from '../../../../services/api-service';
import { catchError, first, takeUntil } from 'rxjs';

@Component({
  selector: 'app-job-input',
  templateUrl: './job-input.component.html',
  styleUrls: ['./job-input.component.css']
})
export class JobInputComponent {
  jobEditorActive = false;
  jobJSON = "";


  @HostListener('click', ['$event']) expandJobEditor(event: MouseEvent) {
    this.toggleJobEditor();
  }

  constructor(private apiService: ApiService) { }

  toggleJobEditor() {
    this.jobEditorActive = !this.jobEditorActive;
  }

  saveJob() {
    try {
      this.apiService.createJob(JSON.parse(this.jobJSON)).pipe(first()).subscribe((j) =>
        console.log('Job created', j)
      );
      this.toggleJobEditor();
    }
    catch (error) {
      console.log(error);
      alert("Invalid JSON");
    }
  }

  usePredefinedJob() {
    this.jobJSON = SampleJob;
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
}
