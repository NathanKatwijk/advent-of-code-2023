import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-day-9-2',
  templateUrl: './day-9-2.component.html',
  styleUrls: ['./day-9-2.component.css']
})
export class Day92Component extends DayComponent implements OnInit {
  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-9/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, data.split('\n').length - 1);
    // console.log('splittedStringList', splittedStringList);

    const histories = this.retrieveHistories(splittedStringList);
    // console.log('histories', histories);

    const extrapolatedValuesBackInTime = this.retrieveExtrapolatedValuesBackInTime(histories);
    // console.log('extrapolatedValuesBackInTime', extrapolatedValuesBackInTime);

    this.result = this.calculateResult(extrapolatedValuesBackInTime);

    // console.log('=====');
    // console.log(`Day 9.2 result: ${this.result}`);
  }

  retrieveHistories(historyStrings: string[]): number[][] {
    return historyStrings.map((historyString: string) =>
      historyString.split(' ').map((historyStep: string) => parseInt(historyStep.trim(), 10))
    );
  }

  retrieveExtrapolatedValuesBackInTime(histories: number[][]): number[] {
    const extrapolatedValuesBackInTime: number[] = [];

    histories.forEach((history: number[]) => {
      const historySequences = this.calculateNextHistorySequence([history]);
      // console.log('historySequences', historySequences);

      const extrapolatedValueBackInTime = this.calculateExtrapolatedValueBackInTime(historySequences);
      // console.log('extrapolatedValuesBackInTime', extrapolatedValuesBackInTime);
      extrapolatedValuesBackInTime.push(extrapolatedValueBackInTime);
    });

    return extrapolatedValuesBackInTime;
  }

  calculateNextHistorySequence(sequences: number[][]): number[][] {
    const lastSequence = sequences[sequences.length-1];
    if (lastSequence.every((sequenceItem) => sequenceItem === 0)) {
      return sequences;
    } else {
      const newSequence: number[] = [];
      lastSequence.forEach((sequenceItem: number, sequenceIndex: number) => {
        if (sequenceIndex < lastSequence.length - 1) {
          newSequence.push(lastSequence[sequenceIndex+1] - sequenceItem);
        }
      });

      return this.calculateNextHistorySequence([ ...sequences, newSequence]);
    }
  }

  calculateExtrapolatedValueBackInTime(historySequences: number[][]): number {
    const reversedHistorySequences = historySequences.reverse();
    let extrapolatedValue = 0;
    // console.log('extrapolatedValue', extrapolatedValue);

    reversedHistorySequences.forEach((historySequence: number[], index: number) => {
      if (index < reversedHistorySequences.length - 1) {
        const nextSequence = reversedHistorySequences[index + 1];

        const startNumber = nextSequence[0];

        extrapolatedValue = startNumber - extrapolatedValue;
        // console.log('extrapolatedValue', extrapolatedValue);
      }
    });

    return extrapolatedValue;
  }

  calculateResult(extrapolatedValues: number[]): number {
    return extrapolatedValues.reduce((acc: number, value: number) => acc + value, 0);
  }
}
