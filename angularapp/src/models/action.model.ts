import { ProgressResponse } from './progress.model';

export interface ActionResponse {
  id: number;
  title: string;
  state: number;
  timeConsume: string;
  progress: ProgressResponse;
}
