import { ActionResponse } from './action.model';

export interface StepResponse {
  id: number;
  index: number;
  state: string;
  actions: ActionResponse[];
}
