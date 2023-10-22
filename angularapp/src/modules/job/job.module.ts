import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobInputComponent } from './components/job-input/job-input.component';
import { JobItemComponent } from './components/job-item/job-item.component';
import { JobStepItemComponent } from './components/step-item/job-step-item.component';
import { JobActionItemComponent } from './components/action-item/job-action-item.component';
import { JobDashboardComponent } from './components/job-dashboard/job-dashboard.component';
import { StatusNamePipe } from './pipes/status-name.pipe';
import { StatusColorDirective } from './directives/status-color.directive';

@NgModule({
  declarations: [
    JobListComponent,
    JobInputComponent,
    JobItemComponent,
    JobStepItemComponent,
    JobActionItemComponent,
    JobDashboardComponent,
    StatusNamePipe,
    StatusColorDirective,
  ],
  exports: [
    JobListComponent,
    JobInputComponent,
    JobDashboardComponent,
  ],
  imports: [
    CommonModule
  ],
  

})
export class JobModule { }
