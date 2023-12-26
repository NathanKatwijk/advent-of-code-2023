import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DayComponent } from './components/day/day.component';
import { Day11Component } from './components/day-1-1/day-1-1.component';
import { Day12Component } from './components/day-1-2/day-1-2.component';
import { Day21Component } from './components/day-2-1/day-2-1.component';
import { Day22Component } from './components/day-2-2/day-2-2.component';
import { Day31Component } from './components/day-3-1/day-3-1.component';
import { Day32Component } from './components/day-3-2/day-3-2.component';
import { Day41Component } from './components/day-4-1/day-4-1.component';
import { Day42Component } from './components/day-4-2/day-4-2.component';
import { Day51Component } from './components/day-5-1/day-5-1.component';
import { Day52Component } from './components/day-5-2/day-5-2.component';
import { Day61Component } from './components/day-6-1/day-6-1.component';
import { Day62Component } from './components/day-6-2/day-6-2.component';
import { Day71Component } from './components/day-7-1/day-7-1.component';
import { Day72Component } from './components/day-7-2/day-7-2.component';
import { Day81Component } from './components/day-8-1/day-8-1.component';
import { Day82Component } from './components/day-8-2/day-8-2.component';
import { Day822Component } from './components/day-8-2-2/day-8-2-2.component';
import { Day91Component } from './components/day-9-1/day-9-1.component';
import { Day92Component } from './components/day-9-2/day-9-2.component';
import { Day101Component } from './components/day-10-1/day-10-1.component';
import { Day102Component } from './components/day-10-2/day-10-2.component';
import { Day111Component } from './components/day-11-1/day-11-1.component';
import { Day112Component } from './components/day-11-2/day-11-2.component';
import { Day121Component } from './components/day-12-1/day-12-1.component';
import { Day122Component } from './components/day-12-2/day-12-2.component';

@NgModule({
  declarations: [
    AppComponent,
    DayComponent,
    Day11Component,
    Day12Component,
    Day21Component,
    Day22Component,
    Day31Component,
    Day32Component,
    Day41Component,
    Day42Component,
    Day51Component,
    Day52Component,
    Day61Component,
    Day62Component,
    Day71Component,
    Day72Component,
    Day81Component,
    Day82Component,
    Day822Component,
    Day91Component,
    Day92Component,
    Day101Component,
    Day102Component,
    Day111Component,
    Day112Component,
    Day121Component,
    Day122Component,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
