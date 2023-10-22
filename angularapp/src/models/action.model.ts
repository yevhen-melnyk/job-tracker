import { ProgressResponse } from './progress.model';

export interface ActionResponse {
  id: number;
  title: string;
  state: string;
  timeConsume: string;
  progress: ProgressResponse;
}
