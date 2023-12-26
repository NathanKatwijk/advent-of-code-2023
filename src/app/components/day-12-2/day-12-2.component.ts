import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

type SpringRow = {
  conditions: string[];
  conditionsString: string;
  damagedSprings: number[];
  arrangements?: number;
}

@Component({
  selector: 'app-day-12-2',
  templateUrl: './day-12-2.component.html',
  styleUrls: ['./day-12-2.component.css']
})
export class Day122Component extends DayComponent implements OnInit {
  readonly SPRING_OPERATIONAL = '.';
  readonly SPRING_DAMAGED = '#';
  readonly SPRING_UNKNOWN = '?';

  readonly MULTIPLYING_FACTOR = 5;

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-12/example-input-2.txt', { responseType: 'text' }).subscribe((data: any) => {
    // this.httpClient.get('assets/day-12/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, 1); // -1);
    // console.log('splittedStringList', splittedStringList);

    const springRows = this.retrieveSpringRows(splittedStringList);
    // console.log('springRows', springRows);

    this.result = -1; // this.determinePossibleArrangements(springRows);

    // console.log('=====');
    // console.log(`Day 12.2 result: ${this.result}`);
  }

  retrieveSpringRows(springInput: string[]): SpringRow[] {
    return springInput.map((springRowInput) => ({
      conditions: springRowInput
        .substring(0, springRowInput.indexOf(' '))
        .split(''),
      conditionsString: springRowInput
        .substring(0, springRowInput.indexOf(' ')),
      damagedSprings: springRowInput
        .substring(springRowInput.indexOf(' ')+1)
        .split(',')
        .map((numberString: string) => parseInt(numberString.trim(), 10))
    }));
  }

  determinePossibleArrangements(springRows: SpringRow[]): number {
    let possibleArrangements = 0;

    springRows.forEach((springRow: SpringRow, springRowIndex: number) => {
      // console.log('');
      // console.log(`[${springRowIndex}]`);
      // console.log('  > input conditions string', springRow.conditionsString);

      const arrangements = this.getAmountOfMatchingArrangements(springRow.conditionsString, springRow.damagedSprings);

      // console.log(`[${springRowIndex}] amountOfMatchingArrangements: `, arrangements);
      possibleArrangements = possibleArrangements + arrangements;
    });

    return possibleArrangements;
  }

  generateSpringRowRegex(damagedSprings: number[]): RegExp {
    const regexParts = damagedSprings.map((damagedSpringsAmount: number, index: number) => {
      let regexPart = '';

      if (index > 0) {
        if (index === damagedSprings.length - 1) {
          regexPart = '([.\?]+)';
        } else {
          regexPart = '([.\?]+?)';
        }
      }
      regexPart += `([\?#]{${damagedSpringsAmount}})`;

      return regexPart;
    });

    const regex = new RegExp(regexParts.toString().replaceAll(',', ''));
    // console.log('regex', regex);

    return regex;
  }

  generateSpringRowRegexOutfolded(damagedSprings: number[]): RegExp {
    const regexParts = damagedSprings.map((damagedSpringsAmount: number, index: number) => {
      let regexPart = '';

      if (index > 0) {
        if (index === damagedSprings.length - 1) {
          regexPart = '([.\?]+)';
        } else {
          regexPart = '([.\?]+?)';
        }
      }
      regexPart += `([\?#]{${damagedSpringsAmount}})`;

      return regexPart;
    });

    const regexString = regexParts.toString().replaceAll(',', '');
    const regexStringOutfolded = Array(5).fill(regexString).join('([\?]{1})');

    const regexOutfolded = new RegExp(regexStringOutfolded);
    console.log('regex outfolded', regexOutfolded);

    return regexOutfolded;
  }

  getAmountOfMatchingArrangements(conditionsString: string, damagedSprings: number[]): number {
    const matches: string[] = [];

    // const conditionsStringOutfolded = Array(this.MULTIPLYING_FACTOR).fill(conditionsString).join('?');
    // TODO
    const inputStrings = this.generateInputs(conditionsString);
    // console.log('  > inputStrings', inputStrings);
    // const inputStringsOutfolded = this.generateInputsOutfolded(conditionsString);
    // console.log('  > inputStringsOutfolded', inputStringsOutfolded);

    const springRegularExpression = this.generateSpringRowRegex(damagedSprings);
    // const springRegularExpressionOutfolded = this.generateSpringRowRegexOutfolded(damagedSprings);

    const inputStringMatchAmountOfDots = conditionsString.split('.').length - 1;
    const amountOfDamagedSprings = damagedSprings.reduce((acc, value) => acc + value, 0);

    inputStrings.forEach((inputString: string) => {
      const isSameOrHigherAmountOfDots = inputString.split('.').length - 1 >= inputStringMatchAmountOfDots;
      const isSameAmountOfHashes = inputString.split('#').length - 1 === amountOfDamagedSprings;

      if (
        isSameOrHigherAmountOfDots &&
        isSameAmountOfHashes &&
        conditionsString.split('').every((character: string, index: number) => character === '?' || inputString[index] === character)
      ) {
        const regexResult = springRegularExpression.exec(inputString);
        if (regexResult !== null) {
          matches.push(inputString);
        }
      }
    });

    // console.log('  > matches', matches);
    return matches.length;
  }

  /*
    // const conditionsStringOutfolded = Array(this.MULTIPLYING_FACTOR).fill(conditionsString).join('?');
    // const springRegularExpressionOutfolded = this.generateSpringRowRegexOutfolded(springRow.damagedSprings);

    // const amountOfDamagedSprings = springRow.damagedSprings.reduce((acc, value) => acc + value, 0);
    // const amountOfDamagedSpringsOutfolded = amountOfDamagedSprings * this.MULTIPLYING_FACTOR;

    // const outfoldedInputStrings = this.generateInputsOutfolded(conditionsString);
  */

  generateInputs(conditionsString: string): string[] {
    const inputs: string[] = [];

    populateArray(conditionsString.length, "");

    function populateArray(n: number, str: string) {
      if (str.length === n) {
        inputs.push(str);
      } else {
        populateArray(n, str + ".");
        populateArray(n, str + "#");
      }
    }

    return inputs;
  }

  generateInputsOutfolded(conditionsString: string): string[] {
    // console.log('conditionsString', conditionsString);
    const inputs: string[] = [];

    populateArray(conditionsString.length, "");

    function populateArray(conditionsStringLength: number, str: string) {
      const currentStringLength = str.length;
      if (currentStringLength === conditionsStringLength) {
        // console.log('return value', str);
        inputs.push(str);
      } else {
        // console.log({ str, currentStringLength});
        populateArray(conditionsStringLength, str + ".");
        populateArray(conditionsStringLength, str + "#");
      }
    }

    return inputs;
  }
}

// const inputStrings = this.generateInputsOutfolded(50);
// console.log('inputStrings length', inputStrings.length);
// console.log('inputStrings', inputStrings);
