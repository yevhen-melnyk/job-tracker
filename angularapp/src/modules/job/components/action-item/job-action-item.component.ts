import { Component, Input } from '@angular/core';
import { ActionResponse } from '../../../../models/action.model';

@Component({
  selector: 'app-action-item',
  templateUrl: './job-action-item.component.html',
  styleUrls: ['./job-action-item.component.css']
})
export class JobActionItemComponent {
  @Input() action?: ActionResponse;


  get duration(): string {
    return this.action ? this.action.timeConsume : '';
  }

}
