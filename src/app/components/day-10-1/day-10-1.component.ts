import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

interface GridPosition {
  xIndex: number;
  yIndex: number;
}

interface TileInformation {
  gridPosition: GridPosition;
  tile: string;
}

@Component({
  selector: 'app-day-10-1',
  templateUrl: './day-10-1.component.html',
  styleUrls: ['./day-10-1.component.css']
})
export class Day101Component extends DayComponent implements OnInit {
  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-10/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, data.split('\n').length - 1);
    // console.log('splittedStringList', splittedStringList);

    const tileGrid = this.retrieveTileGrid(splittedStringList);
    // console.log('tileGrid', tileGrid);

    const startPosition = this.retrieveGridStartPosition(tileGrid);
    // console.log('startPosition', startPosition);

    this.result = this.determineAmountOfStepsToFarthestPoint(tileGrid, startPosition);

    // console.log('=====');
    // console.log(`Day 10.1 result: ${this.result}`);
  }

  retrieveTileGrid(stringList: string[]): string[][] {
    return stringList.map((string: string) => string.split(''));
  }

  retrieveGridStartPosition(tileGrid: string[][]): TileInformation {
    let startTileInformation: TileInformation = {
      tile: 'S',
      gridPosition: {
        xIndex: -1,
        yIndex: -1
      }
    };

    tileGrid.forEach((tileRow: string[], yIndex: number) => {
      tileRow.forEach((tile: string, xIndex: number) => {
        if (tile === 'S') {
          startTileInformation.gridPosition.xIndex = xIndex;
          startTileInformation.gridPosition.yIndex = yIndex;
        }
      });
    });

    return startTileInformation;
  }

  determineAmountOfStepsToFarthestPoint(tileGrid: string[][], startPosition: TileInformation): number {
    let amountOfSteps = 1;

    let previousTilePositionOfLoop1 = startPosition;
    let previousTilePositionOfLoop2 = startPosition;
    let tilePositionOfLoop1 = this.determineNextPositions(tileGrid, startPosition)[0];
    let tilePositionOfLoop2 = this.determineNextPositions(tileGrid, startPosition)[1];

    // console.log('first tilePositionOfLoop1', tilePositionOfLoop1);
    // console.log('first tilePositionOfLoop2', tilePositionOfLoop2);

    while (
      !(tilePositionOfLoop1.gridPosition.xIndex === tilePositionOfLoop2.gridPosition.xIndex &&
      tilePositionOfLoop1.gridPosition.yIndex === tilePositionOfLoop2.gridPosition.yIndex)
    ) {
      const nextTilePositionOfLoop1 = this.determineNextPositions(tileGrid, tilePositionOfLoop1, previousTilePositionOfLoop1)[0];
      const nextTilePositionOfLoop2 = this.determineNextPositions(tileGrid, tilePositionOfLoop2, previousTilePositionOfLoop2)[0];

      previousTilePositionOfLoop1 = JSON.parse(JSON.stringify(tilePositionOfLoop1));
      previousTilePositionOfLoop2 = JSON.parse(JSON.stringify(tilePositionOfLoop2));

      tilePositionOfLoop1 = nextTilePositionOfLoop1;
      tilePositionOfLoop2 = nextTilePositionOfLoop2;

      // console.log('LOOP 1', { previousTilePositionOfLoop1, tilePositionOfLoop1 });
      // console.log('LOOP 2', { previousTilePositionOfLoop2, tilePositionOfLoop2 });

      amountOfSteps++;
    }

    return amountOfSteps;
  }

  readonly NORTH_AND_SOUTH_PIPE = '|';    // is a vertical pipe connecting north and south.
  readonly EAST_AND_WEST_PIPE = '-';      // is a horizontal pipe connecting east and west.
  readonly NORTH_AND_EAST_PIPE = 'L';     // is a 90-degree bend connecting north and east.
  readonly NORTH_AND_WEST_PIPE = 'J';     // is a 90-degree bend connecting north and west.
  readonly SOUTH_AND_WEST_PIPE = '7';     // is a 90-degree bend connecting south and west.
  readonly SOUTH_AND_EAST_PIPE = 'F';     // is a 90-degree bend connecting south and east.
  readonly START_PIPE = 'S';
  readonly GROUND = '.';

  determineNextPositions(tileGrid: string[][], tileInformation: TileInformation, previousPosition?: TileInformation): TileInformation[] {
    const nextPositions = [];

    const { xIndex, yIndex } = tileInformation.gridPosition;
    const tileXLength = tileGrid[0].length;
    const tileYLength = tileGrid.length;

    const tileAbove = yIndex > 0 && tileGrid                [yIndex - 1]      [xIndex];
    const tileBelow = yIndex < tileYLength - 1 && tileGrid  [yIndex + 1]      [xIndex];
    const tileRight = xIndex < tileXLength - 1 && tileGrid  [yIndex]          [xIndex + 1];
    const tileLeft  = xIndex > 0 && tileGrid                [yIndex]          [xIndex - 1];

    // Naar boven
    if (tileAbove !== undefined && tileAbove !== this.GROUND &&
      [this.NORTH_AND_SOUTH_PIPE, this.SOUTH_AND_WEST_PIPE, this.SOUTH_AND_EAST_PIPE].includes(tileAbove + '') &&
      (
        [this.NORTH_AND_SOUTH_PIPE, this.NORTH_AND_EAST_PIPE, this.NORTH_AND_WEST_PIPE].includes(tileInformation.tile) ||
        tileInformation.tile === this.START_PIPE
      )
    ) {
        nextPositions.push({
          tile: tileAbove + '',
          gridPosition: {
            xIndex: xIndex,
            yIndex: yIndex - 1,
          }
        });
    }

    // Naar beneden
    if (tileBelow !== undefined && tileBelow !== this.GROUND &&
      [this.NORTH_AND_SOUTH_PIPE, this.NORTH_AND_EAST_PIPE, this.NORTH_AND_WEST_PIPE].includes(tileBelow + '') &&
      (
        [this.NORTH_AND_SOUTH_PIPE, this.SOUTH_AND_WEST_PIPE, this.SOUTH_AND_EAST_PIPE].includes(tileInformation.tile) ||
        tileInformation.tile === this.START_PIPE
      )
    ) {
        nextPositions.push({
          tile: tileBelow + '',
          gridPosition: {
            xIndex: xIndex,
            yIndex: yIndex + 1,
          }
        });
    }

    // Naar rechts
    if (tileRight !== undefined && tileRight !== this.GROUND &&
      [this.EAST_AND_WEST_PIPE, this.NORTH_AND_WEST_PIPE, this.SOUTH_AND_WEST_PIPE].includes(tileRight + '') &&
      (
        [this.EAST_AND_WEST_PIPE, this.NORTH_AND_EAST_PIPE, this.SOUTH_AND_EAST_PIPE].includes(tileInformation.tile) ||
        tileInformation.tile === this.START_PIPE
      )
    ) {
        nextPositions.push({
          tile: tileRight + '',
          gridPosition: {
            xIndex: xIndex + 1,
            yIndex: yIndex,
          }
        });
    }

    // Naar links
    if (tileLeft !== undefined && tileLeft !== this.GROUND &&
      [this.EAST_AND_WEST_PIPE, this.NORTH_AND_EAST_PIPE, this.SOUTH_AND_EAST_PIPE].includes(tileLeft + '') &&
      (
        [this.EAST_AND_WEST_PIPE, this.NORTH_AND_WEST_PIPE, this.SOUTH_AND_WEST_PIPE].includes(tileInformation.tile) ||
        tileInformation.tile === this.START_PIPE
      )
    ) {
        nextPositions.push({
          tile: tileLeft + '',
          gridPosition: {
            xIndex: xIndex - 1,
            yIndex: yIndex,
          }
        });
    }

    // console.log('determineNextPositions', { nextPositions, previousPosition });
    if (previousPosition !== undefined) {
      return nextPositions.filter((nextPosition: TileInformation) => (
        nextPosition.gridPosition.xIndex !== previousPosition.gridPosition.xIndex ||
        nextPosition.gridPosition.yIndex !== previousPosition.gridPosition.yIndex
      ));
    }

    return nextPositions;
  }
}
