import { Component, Input } from '@angular/core';
import { StepResponse } from '../../../../models/step.model';

@Component({
  selector: 'app-step-item',
  templateUrl: './job-step-item.component.html',
  styleUrls: ['./job-step-item.component.css']
})
export class JobStepItemComponent {
  @Input() step?: StepResponse;

}
