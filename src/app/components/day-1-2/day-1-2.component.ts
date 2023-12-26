import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayComponent } from '../day/day.component';

type NumberLettersMatch = {
  number: number,
  foundIndex: number
};

@Component({
  selector: 'app-day-1-2',
  templateUrl: './day-1-2.component.html',
  styleUrls: ['./day-1-2.component.css']
})
export class Day12Component extends DayComponent implements OnInit {
  numberStrings = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

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

      const numberLettersMatches = this.retrieveNumberLettersMatches(item);

      const firstNumberString = this.retrieveFirstNumber(item, numberLettersMatches);
      const lastNumberString = this.retrieveLastNumber(item, numberLettersMatches);

      const addition = parseInt(firstNumberString + '' + lastNumberString)

      return acc + addition;
    }, 0);

    // console.log('=====');
    // console.log(`Day 1.2 result: ${this.result}`);
  }

  retrieveNumberLettersMatches(item: string): NumberLettersMatch[] {
    const numberLettersMatches: NumberLettersMatch[] = [];

    this.numberStrings.forEach((numberString, index) => {
      const firstResult = { number: index + 1, foundIndex: item.indexOf(numberString) };
      const lastResult = { number: index + 1, foundIndex: item.lastIndexOf(numberString) };

      if (firstResult.foundIndex !== lastResult.foundIndex) {
        numberLettersMatches.push(firstResult);
        numberLettersMatches.push(lastResult);
      } else {
        numberLettersMatches.push(firstResult);
      }
    });

    return numberLettersMatches.filter((numberLettersMatch) => numberLettersMatch.foundIndex > -1);
  }

  retrieveFirstNumber(item: string, numberLettersMatches: NumberLettersMatch[]): number {
    const firstNumberMatches = {
      // @ts-ignore
      number: parseInt(item.match(/[0-9]{1}/)[0][0], 10),
      // @ts-ignore
      foundIndex: item.match(/[0-9]{1}/).index
    };

    const firstMatches = [
      ...numberLettersMatches,
      firstNumberMatches
    ];
    // @ts-ignore
    const sortedFirstMatches = [...firstMatches].sort(this.compareFirst);

    return sortedFirstMatches[0].number;
  }

  retrieveLastNumber(item: string, numberLettersMatches: NumberLettersMatch[]): number {
    const lastNumberMatches = {
      // @ts-ignore
      number: parseInt(item.match('\\d+(\?=\\D\*\$)')[0], 10),
      // @ts-ignore
      foundIndex: item.match('\\d+(\?=\\D\*\$)').index
    };

    const lastNumberCharacterMatch = {
      // @ts-ignore
      number: parseInt((lastNumberMatches.number+'')[(lastNumberMatches.number+'').length-1], 10),
      // @ts-ignore
      foundIndex: lastNumberMatches.foundIndex + (lastNumberMatches.number+'').length-1,
    };

    const lastMatches = [
      ...numberLettersMatches,
      lastNumberCharacterMatch
    ];

    // @ts-ignore
    const sortedLastMatches = [...lastMatches].sort(this.compareLast);

    return sortedLastMatches[0].number;
  }

  compareFirst(aNumber: { foundIndex: number }, bNumber: { foundIndex: number }) {
    if (aNumber.foundIndex < bNumber.foundIndex ){
      return -1;
    }
    if (aNumber.foundIndex > bNumber.foundIndex ){
      return 1;
    }
    return 0;
  }

  compareLast(aNumber: { foundIndex: number }, bNumber: { foundIndex: number }) {
    if (aNumber.foundIndex > bNumber.foundIndex ){
      return -1;
    }
    if (aNumber.foundIndex < bNumber.foundIndex ){
      return 1;
    }
    return 0;
  }
}

// Mislukte implementatie van de retrieveNumberLettersMatches functie

// const matches = item.match(numberString)?.map((matchResult) => ({
//   number: index + 1,
//   // foundIndex: -1,
//   // @ts-ignore
//   foundIndex: matchResult.index
// }));

// @ts-ignore
// return (matches?.length > 0) ? matches : { number: -1, foundIndex: -1 };
// })
// ({ number: index + 1, foundIndex: item.indexOf(numberString) }))


// Meer commentaar

// const splittedStringList = data.split('\n').slice(0, 10); // TEMP!

// Alternatieve regex: (\bone|two|three|four|five|six|seven|eight|nine|ten|[0-9])
