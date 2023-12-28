import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-day-15-1',
  templateUrl: './day-15-1.component.html',
  styleUrls: ['./day-15-1.component.css']
})
export class Day151Component extends DayComponent implements OnInit {
  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    // this.httpClient.get('assets/day-15/example-input-2.txt', { responseType: 'text' }).subscribe((data: any) => {
    this.httpClient.get('assets/day-15/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, -1);
    // console.log('splittedStringList', splittedStringList);

    const sequenceSteps = splittedStringList[0].split(',');
    // console.log('sequenceSteps', sequenceSteps);

    this.result = this.calculateResult(sequenceSteps);

    // console.log('=====');
    // console.log(`Day 15.1 result: ${this.result}`);
  }

  calculateResult(sequenceSteps: string[]): number {
    return sequenceSteps.reduce((acc: number, sequenceStep: string) =>
      acc + this.calculateHashAlgoritmValue(sequenceStep)
    , 0);
  }

  calculateHashAlgoritmValue(sequenceStep: string): number {
    let currentValue = 0;

    sequenceStep.split('').forEach((stepCharacter: string) => {
      const asciiCode = stepCharacter.charCodeAt(0);

      // console.log('> calculation result: ', ((currentValue + asciiCode) * 17) % 256);
      currentValue = ((currentValue + asciiCode) * 17) % 256;
      // console.log('> currentValue: ', currentValue);
    });

    // console.log(`Result [${sequenceStep}]: `, currentValue);
    return currentValue;
  }
}
