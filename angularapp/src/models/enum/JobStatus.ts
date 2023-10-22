export enum JobState {
  InProgress = 0,
  Success = 1,
  Failed = 2
}

// yeah it's better to have separate files for this but im short on time
export enum StepState {
  Pending = 0,
  InProgress = 1,
  Success = 2,
  Failed = 3,
  CompletedWithErrors = 4
}

export enum ActionState {
  InProgress = 0,
  Success = 1,
  Failed = 2
}
