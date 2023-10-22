import { ActionResponse } from "./action.model";

export interface ProgressResponse {
  actionId: number;
  start?: Date;
  end?: Date;
  remaining: number;
  percent: number;
  duration: string;

  action?: ActionResponse;
}
