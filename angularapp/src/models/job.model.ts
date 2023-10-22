import { StepResponse } from './step.model';

export interface JobResponse {
  id: number;
  title: string;
  state: number;
  steps: StepResponse[];
}
