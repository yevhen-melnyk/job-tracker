import { Component } from '@angular/core';
import { SampleJob } from './SampleJob';
import { ApiService } from '../../../../services/api-service';

@Component({
  selector: 'app-job-input',
  templateUrl: './job-input.component.html',
  styleUrls: ['./job-input.component.css']
})
export class JobInputComponent {
  jobEditorActive = false;
  jobJSON = "";

  constructor(private apiService: ApiService) { }

  toggleJobEditor() {
    this.jobEditorActive = !this.jobEditorActive;
  }

  saveJob() {
    try {
      this.apiService.createJob(JSON.parse(this.jobJSON));
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
}
