import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { JobResponse } from '../models/job.model';
import { ProgressResponse } from '../models/progress.model';
import { ActionResponse } from '../models/action.model';
import { StepResponse } from '../models/step.model';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: HubConnection | null = null;

  // Using RxJS BehaviorSubject to hold and stream the data to components
  private allProgressSubject = new BehaviorSubject<ProgressResponse[]>([]);
  private actionCompletionSubject = new BehaviorSubject<ActionResponse | null>(null);
  private stepCompletionSubject = new BehaviorSubject<StepResponse | null>(null);
  private jobCompletionSubject = new BehaviorSubject<JobResponse | null>(null);
  private jobAddedSubject = new BehaviorSubject<JobResponse | null>(null);

  public allProgress$ = this.allProgressSubject.asObservable();
  public actionCompletion$ = this.actionCompletionSubject.asObservable();
  public stepCompletion$ = this.stepCompletionSubject.asObservable();
  public jobCompletion$ = this.jobCompletionSubject.asObservable();
  public jobAdded$ = this.jobAddedSubject.asObservable();

  constructor() {
    this.buildConnection();
    this.registerEvents();
    this.startConnection();
  }

  private buildConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('/progressHub')
      .build();
  }

  private registerEvents(): void {
    this.hubConnection?.on('ReceiveAllProgress', (data: ProgressResponse[]) => {
      this.allProgressSubject.next(data);
      console.log('ReceiveAllProgress: ', data);
    });

    this.hubConnection?.on('ReceiveActionCompletion', (data: ActionResponse) => {
      this.actionCompletionSubject.next(data);
      console.log('ReceiveActionCompletion: ', data);
    });

    this.hubConnection?.on('ReceiveStepCompletion', (data: StepResponse) => {
      this.stepCompletionSubject.next(data);
      console.log('ReceiveStepCompletion: ', data);
    });

    this.hubConnection?.on('ReceiveJobCompletion', (data: JobResponse) => {
      this.jobCompletionSubject.next(data);
      console.log('ReceiveJobCompletion: ', data);
    });

    this.hubConnection?.on('ReceiveJobAdded', (data: JobResponse) => {
      this.jobAddedSubject.next(data);
      console.log('ReceiveJobAdded: ', data);
    });
  }

  private startConnection(): void {
    this.hubConnection?.start()
      .then(() => console.log('Connection started'))
      .catch(error => console.error('Error starting connection: ', error));
  }
}
