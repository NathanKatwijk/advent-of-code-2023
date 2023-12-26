import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayComponent } from '../day/day.component';

interface AlmanacMapInstruction {
  sourceName?: string;
  destinationName?: string;
  mapInstructionItems?: AlmanacMapInstructionItem[];
}

interface AlmanacMapInstructionItem {
  destinationRangeStart: number;
  destinationRangeEnd: number
  sourceRangeStart: number;
  sourceRangeEnd: number;
  numberDifference: number;
  rangeLength: number;
}

@Component({
  selector: 'app-day-5-2',
  templateUrl: './day-5-2.component.html',
  styleUrls: ['./day-5-2.component.css']
})
export class Day52Component extends DayComponent implements OnInit {
  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-5/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    const splittedAlmanacStringList = data.split('\n').slice(0, data.split('\n').length - 1);
    // console.log('splittedAlmanacStringList', splittedAlmanacStringList);

    const seedRanges = this.retrieveSeedRanges(splittedAlmanacStringList.slice(0, 1)[0]);
    // console.log('seedRanges', seedRanges);

    const mapInstructions = this.retrieveMapInstructions(splittedAlmanacStringList.slice(2));
    // console.log('mapInstructions', mapInstructions);

    // Execution of this function may take 5 to 10 minutes.
    this.result = this.calculateResult(seedRanges, mapInstructions);
    // console.log('=====');
    // console.log(`Day 5.2 result: ${this.result}`);
  }

  retrieveSeedRanges(seedString: string): number[][] {
    // console.log('seedString', seedString);
    const seedInputNumbers = this.retrieveNumbers(seedString);
    // console.log('seedInputNumbers', seedInputNumbers);
    const seedRanges: number[][] = [];

    const chunkSize = 2;
    for (let i = 0; i < seedInputNumbers.length; i += chunkSize) {
      seedRanges.push(seedInputNumbers.slice(i, i + chunkSize));
    }

    return seedRanges;
  }

  retrieveMapInstructions(stringRowList: string[]): AlmanacMapInstruction[] {
    const mapInstructions: AlmanacMapInstruction[] = [];

    let mapInstruction: AlmanacMapInstruction = {};
    stringRowList.forEach((stringRow: string) => {
      if (stringRow.indexOf(':') > -1) {
        if (Object.keys(mapInstruction).length > 0) {
          mapInstructions.push(mapInstruction);
        }

        const splittedStringRow = stringRow.substring(0, stringRow.length - 5).split('-');
        mapInstruction = {
          sourceName: splittedStringRow[0],
          destinationName: splittedStringRow[2]
        };
      } else if (stringRow.match(/(\d+\s+)+/)) {
        const numbers = this.retrieveNumbers(stringRow);

        const mapInstructionItem = {
          destinationRangeStart: numbers[0],
          destinationRangeEnd: numbers[0] + numbers[2] - 1,
          sourceRangeStart: numbers[1],
          sourceRangeEnd: numbers[1] + numbers[2] - 1,
          numberDifference: numbers[0] - numbers[1],
          rangeLength: numbers[2]
        };

        mapInstruction = {
          ...mapInstruction,
          // @ts-ignore
          mapInstructionItems: mapInstruction.mapInstructionItems?.length > 0 ? [...mapInstruction.mapInstructionItems, mapInstructionItem ] : [ mapInstructionItem ]
        };
      }
    });
    mapInstructions.push(mapInstruction);

    return mapInstructions;
  }

  retrieveNumbers(numbersString: string): number[] {
    return numbersString
      .substring(numbersString.indexOf(':')+1)
      .trim()
      .split(/\s+/)
      .map((numberString: string) => parseInt(numberString.trim(), 10));
  }

  calculateResult(seedRanges: number[][], mapInstructions: AlmanacMapInstruction[]): number {
    const locationNumbers: number[] = seedRanges.map((seedRange: number[]) => {
      const seedStart = seedRange[0];
      const seedRangeLength = seedRange[1];
      let lowestRangeLocationNumber = this.calculateLocationNumber(mapInstructions, seedStart);
      // console.log({ seedStart, seedRangeLength, lowestRangeLocationNumber });

      for (let index = 0; index < seedRangeLength - 1; index++) {
        const seedNumber = seedStart + 1 + index;
        const calculatedLocationNumber = this.calculateLocationNumber(mapInstructions, seedNumber);

        if (calculatedLocationNumber < lowestRangeLocationNumber) {
          lowestRangeLocationNumber = calculatedLocationNumber;
        }
      }

      return lowestRangeLocationNumber;
    });

    // console.log('locationNumbers', locationNumbers);
    return Math.min(...locationNumbers);
  }

  calculateLocationNumber(mapInstructions: AlmanacMapInstruction[], seedNumber: number): number {
    let result = 0;

    mapInstructions.forEach((mapInstruction: AlmanacMapInstruction, index: number) => {
      if (index === 0) {
        // @ts-ignore
        result = this.retrieveDestinationNumber(mapInstruction.mapInstructionItems, seedNumber);
      } else {
        // @ts-ignore
        result = this.retrieveDestinationNumber(mapInstruction.mapInstructionItems, result);
      }
    })

    return result;
  }

  retrieveDestinationNumber(mapInstructionItems: AlmanacMapInstructionItem[], sourceNumber: number): number {
    // console.log('retrieveDestinationNumber', mapInstructionItems, { sourceNumber });
    const matchingMapInstruction = mapInstructionItems.find((item) =>
      sourceNumber >= item.sourceRangeStart && sourceNumber <= item.sourceRangeEnd
    );

    // console.log('matchingMapInstruction', matchingMapInstruction);
    if (matchingMapInstruction) {
      return sourceNumber + matchingMapInstruction.numberDifference;
    } else {
      return sourceNumber;
    }
  }
}

// const subSeedRange = new Array(seedRangeLength);
// subSeedRange[0] = seedStart;

// for (let index = 0; index < seedRangeLength - 1; index++) {
//   subSeedRange[1 + index] = (seedStart + 1 + index);
// }

// const seedsPart = [
//   seedStart,
//   ...Array.from({length: seedRangeLength - 1}, (_, index) => seedStart + 1 + index)
// ];

// console.log('subSeedRange', subSeedRange);
//     return subSeedRange;
//   }).flat();

// console.log('seeds', seeds);
//   return seeds;
// }

