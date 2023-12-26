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

interface GridDifference {
  xDiff: number;
  yDiff: number
}

@Component({
  selector: 'app-day-10-2',
  templateUrl: './day-10-2.component.html',
  styleUrls: ['./day-10-2.component.css']
})
export class Day102Component extends DayComponent implements OnInit {
  readonly NORTH_AND_SOUTH_PIPE = '|';    // is a vertical pipe connecting north and south.
  readonly EAST_AND_WEST_PIPE = '-';      // is a horizontal pipe connecting east and west.
  readonly NORTH_AND_EAST_PIPE = 'L';     // is a 90-degree bend connecting north and east.
  readonly NORTH_AND_WEST_PIPE = 'J';     // is a 90-degree bend connecting north and west.
  readonly SOUTH_AND_WEST_PIPE = '7';     // is a 90-degree bend connecting south and west.
  readonly SOUTH_AND_EAST_PIPE = 'F';     // is a 90-degree bend connecting south and east.
  readonly START_PIPE = 'S';
  readonly GROUND = '.';

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

    const entireLoop = this.determineEntireLoop(tileGrid, startPosition);
    // console.log('entireLoop', entireLoop);

    const entireLoopWithReplacedStartPipe = this.determineEntireLoopWithReplacedStartPipe(entireLoop);
    // console.log('entireLoopWithReplacedStartPipe', entireLoopWithReplacedStartPipe);
    // console.log(`> replaced S with ${entireLoopWithReplacedStartPipe[0].tile}`);

    const enclosedTiles = this.retrieveEnclosedTiles(tileGrid, entireLoopWithReplacedStartPipe);
    // console.log('enclosedTiles', enclosedTiles);

    this.result = enclosedTiles.length;

    // console.log('=====');
    // console.log(`Day 10.2 result: ${this.result}`);
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

  determineEntireLoop(tileGrid: string[][], startPosition: TileInformation): TileInformation[] {
    const tilePositionsOfLoop: TileInformation[] = [ this.determineNextPositions(tileGrid, startPosition)[0] ];
    let loopLastIndex = 0;

    while (
      !(startPosition.gridPosition.xIndex === tilePositionsOfLoop[loopLastIndex].gridPosition.xIndex &&
        startPosition.gridPosition.yIndex === tilePositionsOfLoop[loopLastIndex].gridPosition.yIndex)
    ) {
      const nextTilePositionOfLoop = this.determineNextPositions(tileGrid, tilePositionsOfLoop[loopLastIndex], tilePositionsOfLoop[loopLastIndex - 1])[0];

      if (nextTilePositionOfLoop !== undefined) {
        tilePositionsOfLoop.push(nextTilePositionOfLoop);
      } else {
        tilePositionsOfLoop.push(startPosition);
      }

      loopLastIndex++;
    }

    // @ts-ignore
    tilePositionsOfLoop.unshift(tilePositionsOfLoop.pop());
    return tilePositionsOfLoop;
  }

  determineNextPositions(tileGrid: string[][], tileInformation: TileInformation, previousPosition?: TileInformation): TileInformation[] {
    const nextPositions = [];

    const { xIndex, yIndex } = tileInformation.gridPosition;
    const tileXLength = tileGrid[0].length;
    const tileYLength = tileGrid.length;

    const tileAbove = yIndex > 0 && tileGrid                [yIndex - 1]      [xIndex];
    const tileBelow = yIndex < tileYLength - 1 && tileGrid  [yIndex + 1]      [xIndex];
    const tileRight = xIndex < tileXLength - 1 && tileGrid  [yIndex]          [xIndex + 1];
    const tileLeft  = xIndex > 0 && tileGrid                [yIndex]          [xIndex - 1];

    // [1] Naar boven
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

    // [2] Naar beneden
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

    // [3] Naar rechts
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

    // [4] Naar links
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

    if (previousPosition !== undefined) {
      return nextPositions.filter((nextPosition: TileInformation) => (
        nextPosition.gridPosition.xIndex !== previousPosition.gridPosition.xIndex ||
        nextPosition.gridPosition.yIndex !== previousPosition.gridPosition.yIndex
      ));
    }

    return nextPositions;
  }

  determineEntireLoopWithReplacedStartPipe(entireLoop: TileInformation[]): TileInformation[] {
    const loopItemBeforeStartItem = entireLoop[entireLoop.length - 1];
    const loopItemAfterStartItem = entireLoop[1];

    const { xIndex, yIndex } = entireLoop[0].gridPosition;

    const beforeXIndex =  loopItemBeforeStartItem.gridPosition.xIndex;
    const afterXIndex =   loopItemAfterStartItem.gridPosition.xIndex;
    const beforeYIndex =  loopItemBeforeStartItem.gridPosition.yIndex;
    const afterYIndex =   loopItemAfterStartItem.gridPosition.yIndex;

    let replacedTile = '';

    if (beforeXIndex === afterXIndex) {
      replacedTile = this.NORTH_AND_SOUTH_PIPE;
    }
    else if (beforeYIndex === afterYIndex) {
      replacedTile = this.EAST_AND_WEST_PIPE;
    }
    else if (
      ((beforeXIndex + 1) === afterXIndex && (beforeYIndex + 1 === afterYIndex) && (beforeYIndex + 1 === yIndex)) ||
      ((beforeXIndex - 1) === afterXIndex && (beforeYIndex - 1 === afterYIndex) && (beforeXIndex - 1 === xIndex))
    ) {
      replacedTile = this.NORTH_AND_EAST_PIPE;
    }
    else if (
      ((beforeXIndex - 1) === afterXIndex && (beforeYIndex + 1 === afterYIndex) && (beforeYIndex + 1 === yIndex)) ||
      ((beforeXIndex + 1) === afterXIndex && (beforeYIndex - 1 === afterYIndex) && (beforeXIndex + 1 === xIndex))
    ) {
      replacedTile = this.NORTH_AND_WEST_PIPE;
    }
    else if (
      ((beforeXIndex - 1) === afterXIndex && (beforeYIndex - 1 === afterYIndex) && (beforeYIndex - 1 === yIndex)) ||
      ((beforeXIndex + 1) === afterXIndex && (beforeYIndex + 1 === afterYIndex) && (beforeXIndex + 1 === xIndex))
    ) {
      replacedTile = this.SOUTH_AND_WEST_PIPE;
    }
    else if (
      ((beforeXIndex + 1) === afterXIndex && (beforeYIndex - 1 === afterYIndex) && (beforeYIndex + 1 === yIndex)) ||
      ((beforeXIndex - 1) === afterXIndex && (beforeYIndex + 1 === afterYIndex) && (beforeXIndex - 1 === xIndex))
    ) {
      replacedTile = this.SOUTH_AND_EAST_PIPE;
    }

    return [{
      tile: replacedTile,
      gridPosition: entireLoop[0].gridPosition,
    }, ...entireLoop.slice(1)];
  }

  retrieveEnclosedTiles(tileGrid: string[][], entireLoop: TileInformation[]): TileInformation[] {
    const enclosedTilesFirstFiltering: TileInformation[] = [];
    const freeTiles: TileInformation[] = [];

    // Part 1: filter out the free tiles in the outer ring
    tileGrid.forEach((tileRow: string[], yIndex: number) => {
      tileRow.forEach((tile: string, xIndex: number) => {
        if (
          (yIndex > 0 && yIndex < tileGrid.length - 1) &&
          (xIndex > 0 && xIndex < tileRow.length - 1)
        ) {
          if (this.isTileNotPartOfLoop(entireLoop, xIndex, yIndex)) {
            enclosedTilesFirstFiltering.push({
              tile,
              gridPosition: {
                xIndex,
                yIndex,
              }
            });
          }
        } else if (this.isTileNotPartOfLoop(entireLoop, xIndex, yIndex)) {
          freeTiles.push({
            tile,
            gridPosition: {
              xIndex,
              yIndex,
            }
          });
        }
      });
    });

    // console.log('enclosedTiles not finished 1', enclosedTilesFirstFiltering);
    // console.log('freeTiles not finished', freeTiles)

    // Part 2: filter out the free tiles in the inner rings (outside of the loop circumference)
    let enclosedTiles2Before: TileInformation[] = [];
    let enclosedTiles2After: TileInformation[] = enclosedTilesFirstFiltering;
    while (enclosedTiles2After.length !== enclosedTiles2Before.length) {
      enclosedTiles2Before = [ ...enclosedTiles2After ];
      enclosedTiles2After = [];

      enclosedTiles2Before.forEach((enclosedTile) => {
        if (this.isTileAFreeInnerTile(freeTiles, enclosedTile)) {
          freeTiles.push(enclosedTile);
        } else {
          enclosedTiles2After.push(enclosedTile);
        }
      });
    }

    // console.log('enclosedTiles not finished 2', enclosedTiles2After);
    // console.log('freeTiles not finished 2', freeTiles);

    // Part 3: filter out the free tiles in the inner ring (inside of the loop circumference, but outside the loop surface)
    let enclosedTiles3Before: TileInformation[] = [ ...enclosedTiles2After ];
    let enclosedTiles3After: TileInformation[] = [];

    enclosedTiles3Before.forEach((enclosedTile, checkIndex) => {
      const loopIndicesSize = entireLoop.length - 1;
      const startLoopIndex = this.determineStartLoopIndex(entireLoop, enclosedTile);
      let loopIndex = startLoopIndex;
      let gridDiffCorrection: GridDifference = { xDiff: -1, yDiff: 0};
      let isSearchFinished = false;

      while (!isSearchFinished) {
        const nextLoopIndex = loopIndex < loopIndicesSize ? loopIndex + 1 : 0;

        if (loopIndex === startLoopIndex) { // Only the first time
          gridDiffCorrection = this.determineStartGridDiffCorrection(entireLoop, startLoopIndex);
        } else {
          gridDiffCorrection = this.determineNewGridDiffCorrection(entireLoop[loopIndex], JSON.parse(JSON.stringify(gridDiffCorrection)));
        }

        const nextTilesToCheck = this.determineNextTilesToCheck(tileGrid, entireLoop[loopIndex], gridDiffCorrection);

        loopIndex = parseInt(nextLoopIndex + '');

        nextTilesToCheck.forEach((nextTileToCheck) => {
          if (this.isTileAFreeTile(freeTiles, nextTileToCheck)) {
            freeTiles.push(enclosedTile);
            isSearchFinished = true;
          }
        });

        if (loopIndex === startLoopIndex) {
          enclosedTiles3After.push(enclosedTile);
          isSearchFinished = true;
        }
      }
    });

    // console.log('enclosedTiles not finished 3', { enclosedTiles3Before, enclosedTiles3After });
    // console.log('freeTiles not finished 3', freeTiles);

    return enclosedTiles3After;
  }

  determineStartLoopIndex(entireLoop: TileInformation[], tile: TileInformation): number {
    let currentXIndex = tile.gridPosition.xIndex;
    const yIndex = tile.gridPosition.yIndex;

    while (this.isTileNotPartOfLoop(entireLoop, currentXIndex, yIndex)) {
      currentXIndex++;
    }

    let startLoopIndex = -1;
    entireLoop.forEach((loopItem, loopIndex) => {
      if (loopItem.gridPosition.xIndex === currentXIndex && loopItem.gridPosition.yIndex === yIndex) {
        startLoopIndex = loopIndex;
      }
    });

    return startLoopIndex;
  }

  determineStartGridDiffCorrection(entireLoop: TileInformation[], startLoopIndex: number): GridDifference {
    let startGridDiffCorrection = { xDiff: -1, yDiff: 0 };

    const previousLoopItem = entireLoop[startLoopIndex === 0 ? entireLoop.length - 1 : startLoopIndex - 1];
    const currentLoopItem = entireLoop[startLoopIndex];

    if (currentLoopItem.tile === this.NORTH_AND_EAST_PIPE &&
      (previousLoopItem.gridPosition.xIndex === currentLoopItem.gridPosition.xIndex)) { // L

      startGridDiffCorrection = { xDiff: 0, yDiff: +1};
    }
    else if (currentLoopItem.tile === this.SOUTH_AND_EAST_PIPE &&
      (previousLoopItem.gridPosition.xIndex === currentLoopItem.gridPosition.xIndex)) { // F

      startGridDiffCorrection = { xDiff: 0, yDiff: -1};
    }

    return startGridDiffCorrection;
  }

  determineNewGridDiffCorrection(currentLoopItem: TileInformation, gridDiffCorrection: GridDifference): GridDifference {
    const { xDiff, yDiff } = gridDiffCorrection;
    let newGridDiffCorrection = gridDiffCorrection;

    if (xDiff === -1 && yDiff === 0) { // looking left & going vertical
      if      (currentLoopItem.tile === this.NORTH_AND_EAST_PIPE) {  newGridDiffCorrection = { xDiff:  0,  yDiff: +1 }}    // looking left & going down
      else if (currentLoopItem.tile === this.NORTH_AND_WEST_PIPE) {  newGridDiffCorrection = { xDiff:  0,  yDiff: -1 }}    // looking left & going down
      else if (currentLoopItem.tile === this.SOUTH_AND_WEST_PIPE) {  newGridDiffCorrection = { xDiff:  0,  yDiff: +1 }}    // looking left & going up
      else if (currentLoopItem.tile === this.SOUTH_AND_EAST_PIPE) {  newGridDiffCorrection = { xDiff:  0,  yDiff: -1 }}    // looking left & going up
    }

    if (xDiff === +1 && yDiff === 0) { // looking right & going vertical
      if      (currentLoopItem.tile === this.NORTH_AND_EAST_PIPE) {  newGridDiffCorrection = { xDiff:  0,  yDiff: -1 }}    // looking right & going down
      else if (currentLoopItem.tile === this.NORTH_AND_WEST_PIPE) {  newGridDiffCorrection = { xDiff:  0,  yDiff: +1 }}    // looking right & going down
      else if (currentLoopItem.tile === this.SOUTH_AND_WEST_PIPE) {  newGridDiffCorrection = { xDiff:  0,  yDiff: -1 }}    // looking right & going up
      else if (currentLoopItem.tile === this.SOUTH_AND_EAST_PIPE) {  newGridDiffCorrection = { xDiff:  0,  yDiff: +1 }}    // looking right & going up
    }

    if (xDiff === 0 && yDiff === +1) { // looking down & going horizontal
      if      (currentLoopItem.tile === this.NORTH_AND_EAST_PIPE) {  newGridDiffCorrection = { xDiff: -1,  yDiff:  0 }}    // looking down & going left
      else if (currentLoopItem.tile === this.NORTH_AND_WEST_PIPE) {  newGridDiffCorrection = { xDiff: +1,  yDiff:  0 }}    // looking down & going right
      else if (currentLoopItem.tile === this.SOUTH_AND_WEST_PIPE) {  newGridDiffCorrection = { xDiff: -1,  yDiff:  0 }}    // looking down & going right
      else if (currentLoopItem.tile === this.SOUTH_AND_EAST_PIPE) {  newGridDiffCorrection = { xDiff: +1,  yDiff:  0 }}    // looking down & going left
    }

    if (xDiff === 0 && yDiff === -1) { // looking up & going horizontal
      if      (currentLoopItem.tile === this.NORTH_AND_EAST_PIPE) {  newGridDiffCorrection = { xDiff: +1,  yDiff:  0 }}    // looking up & going left
      else if (currentLoopItem.tile === this.NORTH_AND_WEST_PIPE) {  newGridDiffCorrection = { xDiff: -1,  yDiff:  0 }}    // looking up & going right
      else if (currentLoopItem.tile === this.SOUTH_AND_WEST_PIPE) {  newGridDiffCorrection = { xDiff: +1,  yDiff:  0 }}    // looking up & going right
      else if (currentLoopItem.tile === this.SOUTH_AND_EAST_PIPE) {  newGridDiffCorrection = { xDiff: -1,  yDiff:  0 }}    // looking up & going left
    }

    return newGridDiffCorrection;
  }

  determineNextTilesToCheck(tileGrid: string[][], currentLoopItem: TileInformation, gridDiffCorrection: GridDifference): TileInformation[] {
    const xIndex = currentLoopItem.gridPosition.xIndex + gridDiffCorrection.xDiff;
    const yIndex = currentLoopItem.gridPosition.yIndex + gridDiffCorrection.yDiff;

    const nextTilesToCheck: TileInformation[] = [ this.getTileInformationFromTile(tileGrid, xIndex, yIndex)];
    return nextTilesToCheck;
  }

  getTileInformationFromTile(tileGrid: string[][], xIndex: number, yIndex: number): TileInformation {
    return { tile: tileGrid[yIndex][xIndex], gridPosition: { xIndex, yIndex }};
  }

  isTileNotPartOfLoop(loop: TileInformation[], xIndex: number, yIndex: number): boolean {
    return loop.every((loopTileItem: TileInformation) => !(loopTileItem.gridPosition.xIndex === xIndex && loopTileItem.gridPosition.yIndex === yIndex));
  }

  isTileAFreeInnerTile(freeTiles: TileInformation[], tile: TileInformation): boolean {
    const { xIndex, yIndex } = tile.gridPosition;

    const hasFreeTileAbove = freeTiles.some((freeTile) =>
      freeTile.gridPosition.yIndex === yIndex - 1 &&
      [freeTile.gridPosition.xIndex -1, freeTile.gridPosition.xIndex, freeTile.gridPosition.xIndex + 1].includes(xIndex)
    );
    const hasFreeTileLeftOrRight = freeTiles.some((freeTile) =>
      freeTile.gridPosition.yIndex === yIndex &&
      [freeTile.gridPosition.xIndex -1, freeTile.gridPosition.xIndex + 1].includes(xIndex)
    );
    const hasFreeTileBelow = freeTiles.some((freeTile) =>
      freeTile.gridPosition.yIndex === yIndex + 1 &&
      [freeTile.gridPosition.xIndex -1, freeTile.gridPosition.xIndex, freeTile.gridPosition.xIndex + 1].includes(xIndex)
    );

    return hasFreeTileAbove || hasFreeTileLeftOrRight || hasFreeTileBelow
  }

  isTileAFreeTile(freeTiles: TileInformation[], tile: TileInformation): boolean {
    const { xIndex, yIndex } = tile.gridPosition;
    return freeTiles.some((freeTile: TileInformation) => freeTile.gridPosition.xIndex === xIndex && freeTile.gridPosition.yIndex === yIndex);
  }
}

// const nextLoopIndex = loopIndex < loopIndicesSize ? loopIndex + 1 : 0;
// gridDiffCorrection = this.determineNewGridDiffCorrection(entireLoop, loopIndex, nextLoopIndex, { ...gridDiffCorrection });

// if (loopIndex < loopIndicesSize) {
//   loopIndex++;
// } else {
//   loopIndex = 0;
// }

// enclosedTiles2After.forEach((enclosedTile) => {
// let checkIsFinished = false;

// const { xIndex, yIndex } = enclosedTile.gridPosition;
// let openingsBetweenHorizontalTiles: TilesConnection[] = this.getHorizontalTileConnections(tileGrid, xIndex, yIndex);
// let openingsBetweenVerticalTiles: TilesConnection[] = this.getVerticalTileConnections(tileGrid, xIndex, yIndex);

// let checkedHorizontalTileConnections: TilesConnection[] = [];
// let checkedVerticalTileConnections: TilesConnection[] = [];

// while (!checkIsFinished) {
//   openingsBetweenHorizontalTiles.slice().forEach((horizontalTileConnection: TilesConnection) => {
//     openingsBetweenHorizontalTiles = this.findOpeningsBetweenHorizontalTiles(tileGrid, horizontalTileConnection, checkedHorizontalTileConnections);
//     checkedHorizontalTileConnections.push(horizontalTileConnection);
//   });

//   openingsBetweenVerticalTiles.slice().forEach((verticalTileConnection: TilesConnection) => {
//     openingsBetweenVerticalTiles = this.findOpeningsBetweenVerticalTiles(tileGrid, verticalTileConnection, checkedVerticalTileConnections);
//     checkedVerticalTileConnections.push(verticalTileConnection);
//   });

//   const allOpeningsBetweenTiles = [ ...openingsBetweenHorizontalTiles, ...openingsBetweenVerticalTiles ];
//   if (allOpeningsBetweenTiles.some((openConnection: TilesConnection) => this.hasFreeTileAroundTilesConnection(freeTiles, openConnection))) {
//     freeTiles.push(enclosedTile);
//     checkIsFinished = true;
//   }

//   if (openingsBetweenHorizontalTiles.length === 0 && openingsBetweenVerticalTiles.length === 0) {
//     enclosedTiles3After.push(enclosedTile);
//     checkIsFinished = true;
//   }
// }

// const recursionResult = this.checkTileRecursive({
//   freeTiles,
//   entireLoop,
//   startPointInLoop,
//   currentPointInLoop,
//   nextTileToCheck,
//   freeTileFound: false,
// });

// }

// hasFreeTileAroundTilesConnection(freeTiles: TileInformation[], tilesConnection: TilesConnection): boolean {
//   return this.isTileAFreeInnerTile(freeTiles, tilesConnection.tile1) || this.isTileAFreeInnerTile(freeTiles, tilesConnection.tile2);
// }

// checkTileRecursive(recursiveTileCheck: RecursiveTileCheck): RecursiveTileCheck {
//   return recursiveTileCheck;
// }

// type RecursiveTileCheck = {
//   freeTiles: TileInformation[],
//   entireLoop: TileInformation[],

//   startPointInLoop: TileInformation;
//   currentPointInLoop: TileInformation;

//   nextTileToCheck: TileInformation;
//   freeTileFound: boolean;
// }

// let horizontalTileConnections: TilesConnection[] = this.getHorizontalTileConnections(tileGrid, xIndex, yIndex);
// let verticalTileConnections: TilesConnection[] = this.getVerticalTileConnections(tileGrid, xIndex, yIndex);

// findOpeningsBetweenHorizontalTiles(tileGrid: string[][], horizontalTileConnection: TilesConnection, checkedHorizontalTileConnections: TilesConnection[]): TilesConnection[] {
//   // TODO
//   return [];
// }

// findOpeningsBetweenVerticalTiles(tileGrid: string[][], verticalTileConnection: TilesConnection, checkedVerticalTileConnections: TilesConnection[]): TilesConnection[] {
//   // TODO
//   return [];
// };

// getHorizontalTileConnections(tileGrid: string[][], xIndex: number, yIndex: number, checkLeft = true, checkRight = true): TilesConnection[] {
//   const connections: TilesConnection[] = [];

//   if (checkLeft) {
//     connections.push(...[
//       { tile1: this.getTileInformationFromTile(tileGrid, xIndex - 1, yIndex - 1),
//         tile2: this.getTileInformationFromTile(tileGrid, xIndex - 1, yIndex)
//       },
//       { tile1: this.getTileInformationFromTile(tileGrid, xIndex - 1, yIndex),
//         tile2: this.getTileInformationFromTile(tileGrid, xIndex - 1, yIndex + 1)
//       }
//     ]);
//   }
//   if (checkRight) {
//     connections.push(...[
//       { tile1: this.getTileInformationFromTile(tileGrid, xIndex + 1, yIndex - 1),
//         tile2: this.getTileInformationFromTile(tileGrid, xIndex + 1, yIndex)
//       },
//       { tile1: this.getTileInformationFromTile(tileGrid, xIndex + 1, yIndex),
//         tile2: this.getTileInformationFromTile(tileGrid, xIndex + 1, yIndex + 1)
//       }
//     ]);
//   };

//   return connections;
// }

// getVerticalTileConnections(tileGrid: string[][], xIndex: number, yIndex: number, checkAbove = true, checkUnder = true): TilesConnection[] {
//   const connections: TilesConnection[] = [];

//   if (checkAbove) {
//     connections.push(...[
//       { tile1: this.getTileInformationFromTile(tileGrid, xIndex - 1, yIndex - 1),
//         tile2: this.getTileInformationFromTile(tileGrid, xIndex,     yIndex - 1)
//       },
//       { tile1: this.getTileInformationFromTile(tileGrid, xIndex,     yIndex - 1),
//         tile2: this.getTileInformationFromTile(tileGrid, xIndex + 1, yIndex - 1)
//       }
//     ]);
//   }
//   if (checkUnder) {
//     connections.push(...[
//       { tile1: this.getTileInformationFromTile(tileGrid, xIndex - 1, yIndex + 1),
//         tile2: this.getTileInformationFromTile(tileGrid, xIndex,     yIndex + 1)
//       },
//       { tile1: this.getTileInformationFromTile(tileGrid, xIndex,     yIndex + 1),
//         tile2: this.getTileInformationFromTile(tileGrid, xIndex + 1, yIndex + 1)
//       }
//     ]);
//   }

//   return connections;
// }

// determineAmountOfStepsToFarthestPoint(tileGrid: string[][], startPosition: TileInformation): number {
//   const tilePositionsOfLoop1: TileInformation[] = [ this.determineNextPositions(tileGrid, startPosition)[0] ];
//   const tilePositionsOfLoop2: TileInformation[] = [ this.determineNextPositions(tileGrid, startPosition)[1] ];

//   let loopLastIndex = 0;

//   while (
//     !(tilePositionsOfLoop1[loopLastIndex].gridPosition.xIndex === tilePositionsOfLoop2[loopLastIndex].gridPosition.xIndex &&
//       tilePositionsOfLoop1[loopLastIndex].gridPosition.yIndex === tilePositionsOfLoop2[loopLastIndex].gridPosition.yIndex)
//   ) {
//     const nextTilePositionOfLoop1 = this.determineNextPositions(tileGrid, tilePositionsOfLoop1[loopLastIndex], tilePositionsOfLoop1[loopLastIndex - 1])[0];
//     const nextTilePositionOfLoop2 = this.determineNextPositions(tileGrid, tilePositionsOfLoop2[loopLastIndex], tilePositionsOfLoop2[loopLastIndex - 1])[0];

//     tilePositionsOfLoop1.push(nextTilePositionOfLoop1);
//     tilePositionsOfLoop2.push(nextTilePositionOfLoop2);

//     loopLastIndex++;
//   }

//   return tilePositionsOfLoop1.length;
// }
