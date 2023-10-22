import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { JobModule } from '../modules/job/job.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, JobModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
