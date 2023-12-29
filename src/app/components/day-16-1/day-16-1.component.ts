import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

type Tile = {
  yIndex: number;
  xIndex: number;
  label: string;
  directions: Direction[];
}

enum Direction {
  UP = 'UP',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  LEFT = 'LEFT'
}

@Component({
  selector: 'app-day-16-1',
  templateUrl: './day-16-1.component.html',
  styleUrls: ['./day-16-1.component.css']
})
export class Day161Component extends DayComponent implements OnInit {
  readonly EMPTY_SPACE_TILE = '.';
  readonly FORWARD_SLASH_MIRROR = '/';
  readonly BACKWARD_SLASH_MIRROR = '\\';
  readonly HORIZONTAL_SPLITTER = '-'; // dash
  readonly VERTICAL_SPLITTER = '|'; // pipe

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-16/example-input.txt', { responseType: 'text' }).subscribe((data: any) => {
    // this.httpClient.get('assets/day-16/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, -1);
    // console.log('splittedStringList', splittedStringList);

    const energizedTiles = this.retrieveEnergizedTiles(splittedStringList);
    // console.log('energizedTiles', energizedTiles);

    this.result = energizedTiles.length;

    // console.log('=====');
    // console.log(`Day 16.1 result: ${this.result}`);
  }

  retrieveEnergizedTiles(tilesContraption: string[]): Tile[] {
    let currentTile = {
      yIndex: 0,
      xIndex: 0,
      label: tilesContraption[0][0],
      directions: [Direction.RIGHT],
    };
    const tiles: Tile[] = [ currentTile ];

    this.determineBeamPath(tilesContraption, tiles, currentTile);

    return tiles;
  }

  determineBeamPath(tilesContraption: string[], tiles: Tile[], currentTile: Tile): void {
    // console.log('current tile', currentTile);
    const nextTiles = this.determineNextTiles(tilesContraption, currentTile);
    // console.log('  next tiles', ...nextTiles);

    nextTiles.forEach((nextTile: Tile) => {
      const existingTile = tiles.find((tile) => tile.yIndex === nextTile.yIndex && tile.xIndex === nextTile.xIndex);

      if (existingTile === undefined) {
        tiles.push(nextTile);

        this.determineBeamPath(tilesContraption, tiles, nextTile);
      } else if (!existingTile.directions.includes(nextTile.directions[0])) {
        const existingTileIndex = tiles.findIndex((tile) => tile.yIndex === nextTile.yIndex && tile.xIndex === nextTile.xIndex);
        tiles[existingTileIndex] = {
          ...tiles[existingTileIndex],
          directions: [ ...tiles[existingTileIndex].directions, nextTile.directions[0] ],
        };

        this.determineBeamPath(tilesContraption, tiles, nextTile);
      }
    });
  }

  determineNextTiles(tilesContraption: string[], currentTile: Tile): Tile[] {
    const { yIndex, xIndex, label, directions } = currentTile;
    const direction = directions[0];

    if (
      [Direction.LEFT, Direction.RIGHT].includes(direction) &&
      [this.EMPTY_SPACE_TILE, this.HORIZONTAL_SPLITTER].includes(label)
    ) {
      const newXIndex = xIndex + (direction === Direction.LEFT ? - 1 : + 1);
      const next = tilesContraption?.[yIndex]?.[newXIndex];
      return next === undefined ? [] : [{ yIndex, xIndex: newXIndex, label: next, directions }];
    } else if (
      [Direction.UP, Direction.DOWN].includes(direction) &&
      [this.EMPTY_SPACE_TILE, this.VERTICAL_SPLITTER].includes(label)
    ) {
      const newYIndex = yIndex + (direction === Direction.UP ? - 1 : + 1);
      const next = tilesContraption?.[newYIndex]?.[xIndex];
      return next === undefined ? [] : [{ yIndex: newYIndex, xIndex, label: next, directions }];
    } else if ([this.FORWARD_SLASH_MIRROR, this.BACKWARD_SLASH_MIRROR].includes(label)) {
      let newYIndex = yIndex;
      let newXIndex = xIndex;
      let newDirection;

      switch (direction) {
        case Direction.UP:
          newXIndex = xIndex + (this.FORWARD_SLASH_MIRROR === label ? 1 : -1);
          newDirection = this.FORWARD_SLASH_MIRROR === label ? Direction.RIGHT : Direction.LEFT;
          break;
        case Direction.RIGHT:
          newYIndex = yIndex + (this.FORWARD_SLASH_MIRROR === label ? -1 : 1);
          newDirection = this.FORWARD_SLASH_MIRROR === label ? Direction.UP : Direction.DOWN;
          break;
        case Direction.DOWN:
          newXIndex = xIndex + (this.FORWARD_SLASH_MIRROR === label ? - 1 : 1);
          newDirection = this.FORWARD_SLASH_MIRROR === label ? Direction.LEFT : Direction.RIGHT;
          break;
        case Direction.LEFT:
          newYIndex = yIndex + (this.FORWARD_SLASH_MIRROR === label ? 1 : -1);
          newDirection = this.FORWARD_SLASH_MIRROR === label ? Direction.DOWN : Direction.UP;
          break;
        default:
          break;
      }

      const next = tilesContraption?.[newYIndex]?.[newXIndex];
      return next === undefined ? [] : [{ yIndex: newYIndex, xIndex: newXIndex, label: next, directions: newDirection ? [newDirection] : [] }];
    } else if (
      [Direction.LEFT, Direction.RIGHT].includes(direction) &&
      label === this.VERTICAL_SPLITTER
    ) {
      const next1 = tilesContraption?.[yIndex - 1]?.[xIndex];
      const next2 = tilesContraption?.[yIndex + 1]?.[xIndex];

      const nextTiles = [];
      if (next1 !== undefined) { nextTiles.push({ yIndex: yIndex - 1, xIndex, label: next1, directions: [Direction.UP] }); }
      if (next2 !== undefined) { nextTiles.push({ yIndex: yIndex + 1, xIndex, label: next2, directions: [Direction.DOWN] }); }
      return nextTiles;
    } else if (
      [Direction.UP, Direction.DOWN].includes(direction) &&
      label === this.HORIZONTAL_SPLITTER
    ) {
      const next1 = tilesContraption?.[yIndex]?.[xIndex - 1];
      const next2 = tilesContraption?.[yIndex]?.[xIndex + 1];

      const nextTiles = [];
      if (next1 !== undefined) { nextTiles.push({ yIndex: yIndex, xIndex: xIndex - 1, label: next1, directions: [Direction.LEFT] }); }
      if (next2 !== undefined) { nextTiles.push({ yIndex: yIndex, xIndex: xIndex + 1, label: next2, directions: [Direction.RIGHT] }); }
      return nextTiles;
    } else {
      console.warn('Not covered case: ', currentTile);
      return [];
    }
  }
}
