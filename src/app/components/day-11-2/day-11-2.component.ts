import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

type UniversePositions = {
  id: number,
  xIndex: number,
  yIndex: number
}

type ExpandedUniverseRanges = {
  xIndices: number[],
  yIndices: number[]
}

@Component({
  selector: 'app-day-11-2',
  templateUrl: './day-11-2.component.html',
  styleUrls: ['./day-11-2.component.css']
})
export class Day112Component extends DayComponent implements OnInit {
  readonly UNIVERSE_EXPANSION = 1000000;

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-11/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, data.split('\n').length - 1);
    // console.log('splittedStringList', splittedStringList);

    const universe = this.retrieveUniverse(splittedStringList);
    // console.log('universe', universe);

    const expandedUniverseRanges = this.retrieveExpandedUniverseRanges(universe);
    // console.log('expandedUniverseRanges', expandedUniverseRanges);

    const universePositions = this.retrieveUniversePositions(universe);
    // console.log('expandedUniverseRanges', expandedUniverseRanges);

    const universePaths = this.retrieveUniversePaths(universePositions, expandedUniverseRanges);
    // console.log('universePaths', universePaths);

    this.result = this.calculateResult(universePaths);

    // console.log('=====');
    // console.log(`Day 11.2 result: ${this.result}`);
  }

  retrieveUniverse(stringList: string[]): string[][] {
    return stringList.map((string: string) => string.split(''));
  }

  retrieveExpandedUniverseRanges(universe: string[][]): ExpandedUniverseRanges {
    const xIndices: number[] = [];
    const yIndices: number[] = [];

    universe.forEach((universeRow: string[], rowIndex: number ) => {
      if (!universeRow.includes('#')) {
        yIndices.push(rowIndex);
      }
    });

    const amountOfRows = universe.length;
    const amountOfColumns = universe[0].length;

    for (let columnIndex = 0; columnIndex < amountOfColumns; columnIndex++) {
      const universeColumn = universe.map((universeRow) => universeRow[columnIndex]);
      // console.warn('universeColumn', universeColumn);

      for (let rowIndex = 0; rowIndex < amountOfRows; rowIndex++) {
        // console.warn(`  universeColumn from row [${rowIndex}]`, universeColumn[rowIndex]);

        if (!universeColumn.includes('#')) {
          xIndices.push(columnIndex);
          // console.warn(`  EXTRA universeColumn from row [${rowIndex}]`, universeColumn[rowIndex]);
        }
      }
    }

    return {
      xIndices: [ ...new Set(xIndices) ],
      yIndices: [ ...new Set(yIndices) ],
    };
  }

  retrieveUniversePositions(universe: string[][]): UniversePositions[] {
    const universePositions: UniversePositions[] = [];

    let id = 1;
    universe.forEach((universeRow, rowIndex) => {
      universeRow.forEach((position, columnIndex) => {
        if (position === '#') {
          universePositions.push({
            id,
            xIndex: columnIndex,
            yIndex: rowIndex
          });
          id++;
        }
      });
    });

    return universePositions;
  }

  retrieveUniversePaths(universePositions: UniversePositions[], expandedUniverseRanges: ExpandedUniverseRanges): number[] {
    const universePaths: number[] = [];
    let startIndex = 1;
    let amountOfPairs = 0;

    universePositions.forEach((currentUniversePosition) => {
      const universePositionsToFind: UniversePositions[] = universePositions.slice(startIndex);
      // console.log('PATH FINDING', {currentUniversePosition, universePositionsToFind});

      universePositionsToFind.forEach((universePositionToFind) => {
        const fromXIndex = currentUniversePosition.xIndex;
        const fromYIndex = currentUniversePosition.yIndex;
        const toXIndex = universePositionToFind.xIndex;
        const toYIndex = universePositionToFind.yIndex;

        let amountOfExpansions = 0;

        expandedUniverseRanges.xIndices.forEach((expandedXIndex) => {
          if ((expandedXIndex > fromXIndex && expandedXIndex < toXIndex) || (expandedXIndex < fromXIndex && expandedXIndex > toXIndex)) {
            amountOfExpansions++;
          }
        });

        expandedUniverseRanges.yIndices.forEach((expandedYIndex) => {
          if (expandedYIndex > fromYIndex && expandedYIndex < toYIndex || (expandedYIndex < fromYIndex && expandedYIndex > toYIndex)) {
            amountOfExpansions++;
          }
        });

        const currentUniversePath =
          (amountOfExpansions * this.UNIVERSE_EXPANSION) +
          Math.abs(fromXIndex - toXIndex) +
          Math.abs(fromYIndex - toYIndex) -
          amountOfExpansions;

        // console.log('> currentUniversePath', { fromXIndex, fromYIndex, toXIndex, toYIndex, currentUniversePath, amountOfExpansions })
        universePaths.push(currentUniversePath);
      });

      startIndex++
      amountOfPairs = amountOfPairs + universePositionsToFind.length;
    })

    // console.log('amountOfPairs', amountOfPairs);
    return universePaths;
  }

  calculateResult(universePaths: number[]): number {
    return universePaths.reduce((acc: number, value: number) => acc + value, 0);
  }
}
