import { Component, Input } from '@angular/core';
import { JobResponse } from '../../../../models/job.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out'))
    ])
  ]
})
export class JobItemComponent {
  @Input() job?: JobResponse;

  stepsExpanded: boolean = false;

  toggleSteps() {
    this.stepsExpanded = !this.stepsExpanded;
  }
}
