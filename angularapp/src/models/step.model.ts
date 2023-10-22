import { ActionResponse } from './action.model';

export interface StepResponse {
  id: number;
  index: number;
  state: number;
  actions: ActionResponse[];
}
