import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { JobResponse } from '../models/job.model';
import { ProgressResponse } from '../models/progress.model';
import { ActionResponse } from '../models/action.model';
import { StepResponse } from '../models/step.model';
import { environment } from '../environments/environment';
import { ActionState, StepState } from '../models/enum/JobStatus';

export type StateResponse = {
  id: number;
  state: number;
} | null;

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: HubConnection | null = null;

  // Using RxJS BehaviorSubject to hold and stream the data to components
  private allProgressSubject = new BehaviorSubject<ProgressResponse[]>([]);
  private actionCompletionSubject = new BehaviorSubject<StateResponse | null>(null);
  private stepCompletionSubject = new BehaviorSubject<StateResponse | null>(null);
  private jobCompletionSubject = new BehaviorSubject<StateResponse | null>(null);
  private jobAddedSubject = new BehaviorSubject<StateResponse | null>(null);

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
      .withUrl(environment.apiUrl + '/progressHub')
      .build();
  }

  private registerEvents(): void {
    this.hubConnection?.on('ReceiveAllProgress', (data: ProgressResponse[], ...args) => {
      this.allProgressSubject.next(data);

      console.log('ReceiveAllProgress: ', data);
    });


    this.hubConnection?.on('ReceiveActionCompletion', (id: number, state: ActionState) => {
      this.actionCompletionSubject.next({ id, state });
      console.log('ReceiveActionCompletion: ', { id, state });
    });

    this.hubConnection?.on('ReceiveStepCompletion', (id: number, state: StepState) => {
      this.stepCompletionSubject.next({ id, state });
      console.log('ReceiveStepCompletion: ', { id, state });
    });

    this.hubConnection?.on('ReceiveJobCompletion', (id: number, state: ActionState) => {
      this.jobCompletionSubject.next({ id, state });
      console.log('ReceiveJobCompletion: ', { id, state });
    });

    this.hubConnection?.on('ReceiveJobAdded', (id: number, state: ActionState) => {
      this.jobAddedSubject.next({ id, state });
      console.log('ReceiveJobAdded: ', { id, state });
    });
  }

  private startConnection(): void {
    this.hubConnection?.start()
      .then(() => console.log('Connection started'))
      .catch(error => console.error('Error starting connection: ', error));
  }
}
