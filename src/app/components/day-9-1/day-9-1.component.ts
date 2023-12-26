import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-day-9-1',
  templateUrl: './day-9-1.component.html',
  styleUrls: ['./day-9-1.component.css']
})
export class Day91Component extends DayComponent implements OnInit {
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

    const extrapolatedValues = this.retrieveExtrapolatedValues(histories);
    // console.log('extrapolatedValues', extrapolatedValues);

    this.result = this.calculateResult(extrapolatedValues);

    // console.log('=====');
    // console.log(`Day 9.1 result: ${this.result}`);
  }

  retrieveHistories(historyStrings: string[]): number[][] {
    return historyStrings.map((historyString: string) =>
      historyString.split(' ').map((historyStep: string) => parseInt(historyStep.trim(), 10))
    );
  }

  retrieveExtrapolatedValues(histories: number[][]): number[] {
    const extrapolatedValues: number[] = [];

    histories.forEach((history: number[]) => {
      const historySequences = this.calculateNextHistorySequence([history]);
      // console.log('historySequences', historySequences);

      const extrapolatedValue = this.calculateExtrapolatedValue(historySequences);
      // console.log('extrapolatedValue', extrapolatedValue);
      extrapolatedValues.push(extrapolatedValue);
    });

    return extrapolatedValues;
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

  calculateExtrapolatedValue(historySequences: number[][]): number {
    const reversedHistorySequences = historySequences.reverse();
    let extrapolatedValue = 0;

    reversedHistorySequences.forEach((historySequence: number[], index: number) => {
      if (index < reversedHistorySequences.length - 1) {
        const nextSequence = reversedHistorySequences[index + 1];

        extrapolatedValue = extrapolatedValue + nextSequence[nextSequence.length - 1];
      }
    });

    return extrapolatedValue;
  }

  calculateResult(extrapolatedValues: number[]): number {
    return extrapolatedValues.reduce((acc: number, value: number) => acc + value, 0);
  }
}
