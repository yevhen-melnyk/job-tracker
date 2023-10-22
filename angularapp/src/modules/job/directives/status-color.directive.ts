import { Directive, ElementRef, Renderer2, Input, OnChanges } from '@angular/core';
import { JobState, StepState, ActionState } from 'src/models/enum/JobStatus';

@Directive({
  selector: '[appStatusColor]'
})
export class StatusColorDirective implements OnChanges {

  @Input() appStatusColor?: number;
  @Input() type?: string;
  private jobColors = {
    [JobState.InProgress]: '#90CAF9', // Pastel Blue
    [JobState.Success]: '#A5D6A7',   // Pastel Green
    [JobState.Failed]: '#EF9A9A'     // Pastel Red
  };

  private stepColors = {
    [StepState.Pending]: '#E0E0E0',          // Light Gray
    [StepState.InProgress]: '#90CAF9',       // Pastel Blue
    [StepState.Success]: '#A5D6A7',         // Pastel Green
    [StepState.Failed]: '#EF9A9A',          // Pastel Red
    [StepState.CompletedWithErrors]: '#FFCC80' // Pastel Orange
  };

  private actionColors = {
    [ActionState.InProgress]: '#90CAF9', // Pastel Blue
    [ActionState.Success]: '#A5D6A7',   // Pastel Green
    [ActionState.Failed]: '#EF9A9A'     // Pastel Red
  };

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges() {
    let color: string;

    switch (this.type) {
      case 'job':
        color = this.appStatusColor && this.jobColors[this.appStatusColor as JobState] || 'black';
        break;
      case 'step':
        color = this.appStatusColor && this.stepColors[this.appStatusColor as StepState] || 'black';
        break;
      case 'action':
        color = this.appStatusColor && this.actionColors[this.appStatusColor as ActionState] || 'black';
        break;
      default:
        color = 'black';
    }

    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }
}
