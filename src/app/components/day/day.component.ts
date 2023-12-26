import { Component } from '@angular/core';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent {
  result?: number;

  process(data: string): void {
    console.log('=====');
    console.log(data);
    console.log(`Day process function placeholder with result: ${this.result}`);
  }
}
