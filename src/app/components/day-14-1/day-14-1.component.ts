import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-day-14-1',
  templateUrl: './day-14-1.component.html',
  styleUrls: ['./day-14-1.component.css']
})
export class Day141Component extends DayComponent implements OnInit {
  readonly ROUNDED_ROCK = 'O';
  readonly CUBE_SHAPED_ROCK = '#';
  readonly EMPTY_SPACE = '.';

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-14/example-input.txt', { responseType: 'text' }).subscribe((data: any) => {
    // this.httpClient.get('assets/day-14/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, -1);
    // console.log('splittedStringList', splittedStringList);

    const platformWithRocksSlidedToNorth = this.slideRocksToNorthOnPlatform(splittedStringList);
    // console.log('platformWithRocksSlidedToNorth', platformWithRocksSlidedToNorth);

    this.result = this.calculateResult(platformWithRocksSlidedToNorth);

    // console.log('=====');
    // console.log(`Day 14.1 result: ${this.result}`);
  }

  slideRocksToNorthOnPlatform(platform: string[]): string[] {
    let platformWithRocksSlidedToNorth = platform.slice();

    for (let yIndex = 1; yIndex < platform.length; yIndex++) {

      for (let xIndex = 0; xIndex < platform[yIndex].length; xIndex++) {
        // console.log(`[${yIndex}][${xIndex}]`)
        const currentPosition = platform[yIndex][xIndex];

        if (currentPosition === this.ROUNDED_ROCK) {
          let abort = false;

          for (let ySlideIndex = yIndex - 1; ySlideIndex >= 0 && !abort; ySlideIndex--) {
            const newPosition = platformWithRocksSlidedToNorth[ySlideIndex][xIndex];

            if ([this.ROUNDED_ROCK, this.CUBE_SHAPED_ROCK].includes(newPosition)) {
              platformWithRocksSlidedToNorth[yIndex] = this.replaceAtIndexInString(
                platformWithRocksSlidedToNorth[yIndex],
                xIndex,
                this.EMPTY_SPACE
              );

              platformWithRocksSlidedToNorth[ySlideIndex + 1] = this.replaceAtIndexInString(
                platformWithRocksSlidedToNorth[ySlideIndex + 1],
                xIndex,
                currentPosition
              );

              abort = true;
            } else if (ySlideIndex === 0) {
              platformWithRocksSlidedToNorth[yIndex] = this.replaceAtIndexInString(
                platformWithRocksSlidedToNorth[yIndex],
                xIndex,
                this.EMPTY_SPACE
              );

              platformWithRocksSlidedToNorth[ySlideIndex] = this.replaceAtIndexInString(
                platformWithRocksSlidedToNorth[ySlideIndex],
                xIndex,
                currentPosition
              );

              abort = true;
            }
          }
        }
      }
    }

    return platformWithRocksSlidedToNorth;
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
