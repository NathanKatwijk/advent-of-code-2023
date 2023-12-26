import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

type UniversePositions = {
  id: number,
  xIndex: number,
  yIndex: number
}

@Component({
  selector: 'app-day-11-1',
  templateUrl: './day-11-1.component.html',
  styleUrls: ['./day-11-1.component.css']
})
export class Day111Component extends DayComponent implements OnInit {
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

    const notExpandedUniverse = this.retrieveNotExpandedUniverse(splittedStringList);
    // console.log('notExpandedUniverse', notExpandedUniverse);

    const expandedUniverse = this.retrieveExpandedUniverse(notExpandedUniverse);
    // console.log('expandedUniverse', expandedUniverse);

    const universePositions = this.retrieveUniversePositions(expandedUniverse);
    // console.log('universePositions', universePositions);

    const universePaths = this.retrieveUniversePaths(universePositions);
    // console.log('universePaths', universePaths);

    this.result = this.calculateResult(universePaths);

    // console.log('=====');
    // console.log(`Day 11.1 result: ${this.result}`);
  }

  retrieveNotExpandedUniverse(stringList: string[]): string[][] {
    return stringList.map((string: string) => string.split(''));
  }

  retrieveExpandedUniverse(notExpandedUniverse: string[][]): string[][] {
    const onlyExpandedRowsUniverse: string[][] = [];

    notExpandedUniverse.forEach((universeRow: string[]) => {
      onlyExpandedRowsUniverse.push(universeRow);
      if (!universeRow.includes('#')) {
        onlyExpandedRowsUniverse.push(universeRow);
      }
    });

    // console.log('onlyExpandedRowsUniverse', onlyExpandedRowsUniverse);

    const amountOfRows = onlyExpandedRowsUniverse.length;
    const amountOfColumns = notExpandedUniverse[0].length;
    const expandedUniverse: string[][] = onlyExpandedRowsUniverse.map(() => []);

    for (let columnIndex = 0; columnIndex < amountOfColumns; columnIndex++) {
      const universeColumn = onlyExpandedRowsUniverse.map((onlyExpandedRowsUniverseRow) => onlyExpandedRowsUniverseRow[columnIndex]);
      // console.warn('universeColumn', universeColumn);

      for (let rowIndex = 0; rowIndex < amountOfRows; rowIndex++) {
        expandedUniverse[rowIndex].push(universeColumn[rowIndex]);
        // console.warn(`  universeColumn from row [${rowIndex}]`, universeColumn[rowIndex]);

        if (!universeColumn.includes('#')) {
          expandedUniverse[rowIndex].push(universeColumn[rowIndex]);
          // console.warn(`  EXTRA universeColumn from row [${rowIndex}]`, universeColumn[rowIndex]);
        }
      }
    }

    return expandedUniverse;
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

  retrieveUniversePaths(universePositions: UniversePositions[]): number[] {
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

        const currentUniversePath =
          Math.abs(fromXIndex - toXIndex) +
          Math.abs(fromYIndex - toYIndex);

        // console.log('> currentUniversePath', { fromXIndex, fromYIndex, toXIndex, toYIndex, currentUniversePath })
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
