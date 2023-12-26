import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayComponent } from '../day/day.component';

@Component({
  selector: 'app-day-1-1',
  templateUrl: './day-1-1.component.html',
  styleUrls: ['./day-1-1.component.css']
})
export class Day11Component extends DayComponent implements OnInit {

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-1/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    const splittedStringList = data.split('\n');

    this.result = splittedStringList.reduce((acc: number, item: string, index: number) => {
      if(!item) {
        return acc;
      }

      // @ts-ignore
      const firstMatches = item.match(/[0-9]{1}/);
      // @ts-ignore
      const firstNumberString = firstMatches[0][0];

      // @ts-ignore
      const lastMatches = item.match('\\d+(\?=\\D\*\$)');
      // @ts-ignore
      const lastNumberString = lastMatches[0][lastMatches[0].length-1];

      return acc + parseInt(firstNumberString + lastNumberString);
    }, 0);

    // console.log('=====');
    // console.log(`Day 1.1 result: ${this.result}`);
  }
}
