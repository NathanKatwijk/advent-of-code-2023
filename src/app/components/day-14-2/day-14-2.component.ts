import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-day-14-2',
  templateUrl: './day-14-2.component.html',
  styleUrls: ['./day-14-2.component.css']
})
export class Day142Component extends DayComponent implements OnInit {
  readonly ROUNDED_ROCK = 'O';
  readonly CUBE_SHAPED_ROCK = '#';
  readonly EMPTY_SPACE = '.';

  readonly AMOUNT_OF_CYCLES =          1000; // 1.000 gives the same result as 1.000.000.000
  // readonly AMOUNT_OF_CYCLES = 1000000000;

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    // this.httpClient.get('assets/day-14/example-input.txt', { responseType: 'text' }).subscribe((data: any) => {
    this.httpClient.get('assets/day-14/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, -1);
    // console.log('initial platform', splittedStringList);

    let platform = splittedStringList.slice();

    // for (let counter = 0; counter < this.AMOUNT_OF_CYCLES; counter = counter + 1000) {
    for (let counter = 0; counter < this.AMOUNT_OF_CYCLES; counter++) {
      // NORTH
      platform = this.slideRocksVerticallyOnPlatform(platform, true);
      // console.log('> platform to north', platform);

      // WEST
      platform = this.slideRocksHorizontallyOnPlatform(platform, true);
      // console.log('> platform to west', platform);

      // SOUTH
      platform = this.slideRocksVerticallyOnPlatform(platform, false);
      // console.log('> platform to south', platform);

      // EAST
      platform = this.slideRocksHorizontallyOnPlatform(platform, false);
      // console.log('> platform to east', platform);

      // console.log(`CYCLE ${counter + 1}: `, platform);
    }

    this.result = this.calculateResult(platform);

    // console.log('=====');
    // console.log(`Day 14.2 result: ${this.result}`);
  }

  // To north or to south
  slideRocksVerticallyOnPlatform(platform: string[], toNorth: boolean): string[] {
    let platformWithRocksSlided = platform.slice();
    const yIndexIncrement = toNorth ? -1 : 1;
    const yEndIndex = platform.length - 1;

    for (
      let yIndex = toNorth ? 1 : yEndIndex;
      (toNorth ? yIndex < platform.length : yIndex >= 0);
      (toNorth ? yIndex++ : yIndex--)
    ) {

      for (let xIndex = 0; xIndex < platform[yIndex].length; xIndex++) {

        if (platform[yIndex][xIndex] === this.ROUNDED_ROCK) {
          let abort = false;

          for (
            let ySlideIndex = yIndex + yIndexIncrement;
            (toNorth ? ySlideIndex >= 0 : ySlideIndex <= yEndIndex) && !abort;
            (ySlideIndex = ySlideIndex + yIndexIncrement)
          ) {
            const newPosition = platformWithRocksSlided[ySlideIndex][xIndex];

            if ([this.ROUNDED_ROCK, this.CUBE_SHAPED_ROCK].includes(newPosition)) {
              const newYIndex = ySlideIndex + (yIndexIncrement *-1);

              if (yIndex !== newYIndex) {
                this.updatePositionsInPlatform(platformWithRocksSlided, yIndex, xIndex, newYIndex, xIndex);
              }

              abort = true;
            } else if ((toNorth && ySlideIndex === 0) || (!toNorth && ySlideIndex === yEndIndex)) {
              this.updatePositionsInPlatform(platformWithRocksSlided, yIndex, xIndex, ySlideIndex, xIndex);

              abort = true;
            }
          }
        }
      }
    }

    return platformWithRocksSlided;
  }

  // To west or to east
  slideRocksHorizontallyOnPlatform(platform: string[], toWest: boolean): string[] {
    let platformWithRocksSlided = platform.slice();
    const xIndexIncrement = toWest ? -1 : 1;
    const xEndIndex = platform[0].length - 1;

    for (let yIndex = 0; yIndex < platform.length; yIndex++) {

      for (
        let xIndex = toWest ? 1 : xEndIndex;
        (toWest ? xIndex < platform[yIndex].length : xIndex >= 0);
        (toWest ? xIndex++ : xIndex--)
      ) {

        if (platform[yIndex][xIndex] === this.ROUNDED_ROCK) {
          let abort = false;

          for (
            let xSlideIndex = xIndex + xIndexIncrement;
            (toWest ? xSlideIndex >= 0 : xSlideIndex <= xEndIndex) && !abort;
            (xSlideIndex = xSlideIndex + xIndexIncrement)
          ) {
            const newPosition = platformWithRocksSlided[yIndex][xSlideIndex];

            if ([this.ROUNDED_ROCK, this.CUBE_SHAPED_ROCK].includes(newPosition)) {
              const newXIndex = xSlideIndex + (xIndexIncrement * -1);

              if (xIndex !== newXIndex) {
                this.updatePositionsInPlatform(platformWithRocksSlided, yIndex, xIndex, yIndex, newXIndex);
              }

              abort = true;
            } else if ((toWest && xSlideIndex === 0) || (!toWest && xSlideIndex === xEndIndex)) {
              this.updatePositionsInPlatform(platformWithRocksSlided, yIndex, xIndex, yIndex, xSlideIndex);

              abort = true;
            }
          }
        }
      }
    }

    return platformWithRocksSlided;
  }

  updatePositionsInPlatform(platform: string[], oldYIndex: number, oldXIndex: number, newYIndex: number, newXIndex: number): void {
    // Set empty space in old position
    platform[oldYIndex] = this.replaceAtIndexInString(
      platform[oldYIndex],
      oldXIndex,
      this.EMPTY_SPACE
    );

    // Set rounded rock in new position
    platform[newYIndex] = this.replaceAtIndexInString(
      platform[newYIndex],
      newXIndex,
      this.ROUNDED_ROCK
    );
  }

  replaceAtIndexInString(inputString: string, index: number, replacement: string): string {
    return inputString.substring(0, index) + replacement + inputString.substring(index + 1);
  }

  calculateResult(platform: string[]): number {
    const reversedPlatform = platform.slice().reverse();

    return reversedPlatform.reduce((acc: number, platformRow: string, index: number) => {
      const amountOfRoundedRocks = platformRow.split(this.ROUNDED_ROCK).length - 1;
      return acc + (amountOfRoundedRocks * (index + 1));
    }, 0);
  };
}
