import { Pipe, PipeTransform } from '@angular/core';
import { ActionState, JobState, StepState } from '../../../models/enum/JobStatus';

@Pipe({
  name: 'statusName'
})
export class StatusNamePipe implements PipeTransform {

  private jobStatusNames: { [key in JobState]: string } = {
    [JobState.InProgress]: 'In Progress',
    [JobState.Success]: 'Success',
    [JobState.Failed]: 'Failed'
  };

  private stepStatusNames: { [key in StepState]: string } = {
    [StepState.Pending]: 'Pending',
    [StepState.InProgress]: 'In Progress',
    [StepState.Success]: 'Success',
    [StepState.Failed]: 'Failed',
    [StepState.CompletedWithErrors]: 'Completed With Errors'
  };

  private actionStatusNames: { [key in ActionState]: string } = {
    [ActionState.InProgress]: 'In Progress',
    [ActionState.Success]: 'Success',
    [ActionState.Failed]: 'Failed'
  };

  transform(value?: number, type?: string): string {
    switch (type) {
      case 'job':
        return this.jobStatusNames[value as JobState]|| 'Unknown';
      case 'step':
        return this.stepStatusNames[value as StepState] || 'Unknown';
      case 'action':
        return this.actionStatusNames[value as ActionState] || 'Unknown';
      default:
        return 'Unknown';
    }
  }
}
