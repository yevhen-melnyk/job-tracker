export interface ProgressResponse {
  start?: Date;
  end?: Date;
  remaining: number;
  percent: number;
  duration: string;
}
