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
  selector: 'app-day-5-1',
  templateUrl: './day-5-1.component.html',
  styleUrls: ['./day-5-1.component.css']
})
export class Day51Component extends DayComponent implements OnInit {
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

    const seeds = this.retrieveNumbers(splittedAlmanacStringList.slice(0, 1)[0]);
    // console.log('seeds', seeds);

    const mapInstructions = this.retrieveMapInstructions(splittedAlmanacStringList.slice(2));
    // console.log('mapInstructions', mapInstructions);

    this.result = this.calculateResult(seeds, mapInstructions);
    // console.log('=====');
    // console.log(`Day 5.1 result: ${this.result}`);
  }

  retrieveNumbers(numbersString: string): number[] {
    return numbersString
      .substring(numbersString.indexOf(':')+1)
      .trim()
      .split(/\s+/)
      .map((numberString: string) => parseInt(numberString.trim(), 10));
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

  calculateResult(seeds: number[], mapInstructions: AlmanacMapInstruction[]): number {
    const locationNumbers: number[] = seeds.map((seed: number) => {
      let result = 0;

      mapInstructions.forEach((mapInstruction: AlmanacMapInstruction, index: number) => {
        if (index === 0) {
          // @ts-ignore
          result = this.retrieveDestinationNumber(mapInstruction.mapInstructionItems, seed);
        } else {
          // @ts-ignore
          result = this.retrieveDestinationNumber(mapInstruction.mapInstructionItems, result);
        }
      })

      return result;
    });
    // console.log('locationNumbers', locationNumbers);

    return Math.min(...locationNumbers);
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


// retrieveMaps(mapInstructions: AlmanacMapInstruction[]): AlmanacMap[] {
//   const maps = mapInstructions.map((mapInstruction) => {
//     const map = {
//       sourceName: mapInstruction.sourceName + '',
//       destinationName: mapInstruction.destinationName + '',
//       map: this.createMapMap(mapInstruction)
//     }
//     return map;
//   });
//
//   return maps;
// }

// createMapMap(mapInstruction: AlmanacMapInstruction): Map<number, number> {
//   const map = new Map<number, number>();
//
//   // console.log('map before', { map, mapInstruction });
//   mapInstruction.mapInstructionItems?.forEach((mapInstructionItem) => {
//     map.set(mapInstructionItem.sourceRangeStart, mapInstructionItem.destinationRangeStart);
//
//     const destinationRangeEnd = mapInstructionItem.destinationRangeStart + mapInstructionItem.rangeLength - 1;
//     const sourceRangeEnd = mapInstructionItem.sourceRangeStart + mapInstructionItem.rangeLength - 1;
//     map.set(sourceRangeEnd, destinationRangeEnd);
//   });
//   // console.log('map after', { map });

//   const mapAscending = new Map([...map.entries()].sort());
//   // console.log('map after ascending', { mapAscending });
//   return mapAscending;
// }

// for (let j = 0; j < mapInstructionItem.rangeLength; j++) {
//   map.set(
//     mapInstructionItem.sourceRangeStart + j,
//     mapInstructionItem.destinationRangeStart + j
//   );
//   // console.log('map between', { map });
// }

// const maps = this.retrieveMaps(mapInstructions);
// console.log('maps', maps);
