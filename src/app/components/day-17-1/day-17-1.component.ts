import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

enum Direction {
  UP = 'UP',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  LEFT = 'LEFT'
}

type Block = {
  yIndex: number,
  xIndex: number,
  heatLoss: number,
  nextDirection: Direction,
}

type Route = {
  blocks: Block[];
  heatLoss: number;
}

@Component({
  selector: 'app-day-17-1',
  templateUrl: './day-17-1.component.html',
  styleUrls: ['./day-17-1.component.css']
})
export class Day171Component extends DayComponent implements OnInit {
  maxHeatLoss: number = -1;

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-17/example-input.txt', { responseType: 'text' }).subscribe((data: any) => {
    // this.httpClient.get('assets/day-17/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, -1);
    // console.log('splittedStringList', splittedStringList);

    const city = this.retrieveCity(splittedStringList);
    // console.log('city', city);

    const exampleRoute = this.determineExampleRoute(city);
    // console.log('exampleRoute', exampleRoute);
    this.maxHeatLoss = exampleRoute.heatLoss;
    // console.log('start max heat loss', this.maxHeatLoss);

    this.result = -1; // this.determineLowestHeatLoss(city);

    // console.log('=====');
    // console.log(`Day 17.1 result: ${this.result}`);
  }

  retrieveCity(cityString: string[]): number[][] {
    return cityString.map((cityRowString: string) =>
      cityRowString.split('').map((cityBlock: string) => parseInt(cityBlock, 10))
    );
  }

  determineExampleRoute(city: number[][]): Route {
    const yEndIndex = city.length - 1;
    const xEndIndex = city[0].length - 1;

    const routeBlocks = [];

    for (let yIndex = 0; yIndex <= yEndIndex;) {
      for (let xIndex = 0; xIndex <= xEndIndex;) {
        routeBlocks.push({
          yIndex,
          xIndex,
          heatLoss: city?.[yIndex]?.[xIndex],
          nextDirection: Direction.RIGHT
        });
        xIndex++
        routeBlocks.push({
          yIndex,
          xIndex,
          heatLoss: city?.[yIndex]?.[xIndex],
          nextDirection: Direction.RIGHT
        });
        xIndex++;
        routeBlocks.push({
          yIndex,
          xIndex,
          heatLoss: city?.[yIndex]?.[xIndex],
          nextDirection: Direction.DOWN
        });
        yIndex++;
        routeBlocks.push({
          yIndex,
          xIndex,
          heatLoss: city?.[yIndex]?.[xIndex],
          nextDirection: Direction.DOWN
        });
        yIndex++;
      }
    }

    let routeHeatLoss = 0;
    routeBlocks
      .filter((block) => block.xIndex <= xEndIndex && block.yIndex <= yEndIndex)
      .forEach((block: Block) => {
        routeHeatLoss += block.heatLoss;
    });

    return {
      blocks: routeBlocks,
      heatLoss: routeHeatLoss
    };
  }

  determineLowestHeatLoss(city: number[][]): number {
    let route1: Route = { blocks: [], heatLoss: Infinity };
    const startBlock1: Block = { yIndex: 0, xIndex: 0, heatLoss: 0, nextDirection: Direction.RIGHT };
    this.determinePossibleRoute(city, [ startBlock1 ], 0, route1);

    let route2: Route = { blocks: [], heatLoss: Infinity };
    const startBlock2: Block = { yIndex: 0, xIndex: 0, heatLoss: 0, nextDirection: Direction.DOWN };
    this.determinePossibleRoute(city, [ startBlock2 ], 0, route2);

    console.log('possibleRoutes', [ route1, route2 ]);

    return Math.min(route1.heatLoss, route2.heatLoss);
  }

  determinePossibleRoute(city: number[][], currentRouteBlocks: Block[], currentHeatLoss: number, possibleRoute: Route): void {
    const nextPossibleBlocks = this.determineNextPossibleBlocks(city, currentRouteBlocks);
    const yEndIndex = city.length - 1;
    const xEndIndex = city[0].length - 1;

    nextPossibleBlocks.forEach((nextPossibleBlock: Block) => {
      const heatLoss = currentHeatLoss + nextPossibleBlock.heatLoss;
      if (nextPossibleBlock.yIndex === yEndIndex && nextPossibleBlock.xIndex === xEndIndex) {
        const possibleRouteBlocks = [
          ...currentRouteBlocks,
          {
            yIndex: yEndIndex,
            xIndex: xEndIndex,
            heatLoss: city[yEndIndex][xEndIndex],
            nextDirection: Direction.RIGHT
          }
        ];

        // console.log('possibleRouteBlocks', possibleRouteBlocks);
        const routeHeatLoss = heatLoss + city[yEndIndex][xEndIndex];

        if (routeHeatLoss < this.maxHeatLoss) {
          this.maxHeatLoss = routeHeatLoss;
          console.log('new max heat loss', this.maxHeatLoss);
          possibleRoute = {
            blocks: possibleRouteBlocks,
            heatLoss
          };
        }
      }

      if (heatLoss < this.maxHeatLoss) {
        this.determinePossibleRoute(city, [ ...currentRouteBlocks, nextPossibleBlock], heatLoss, possibleRoute);
      }
    })

  }

  determineNextPossibleBlocks(city: number[][], currentRouteBlocks: Block[]): Block[] {
    const currentRouteBlock = currentRouteBlocks[currentRouteBlocks.length - 1];
    const lastThreeRouteBlockDirections = currentRouteBlocks.slice(-3).map((block) => block.nextDirection);
    const yEndIndex = city.length  - 1;
    const xEndIndex = city[0].length - 1;

    const nextBlocks: Block[] = [];

    // UP
    if (
      currentRouteBlock.nextDirection !== Direction.DOWN && currentRouteBlock.yIndex > 0 &&
      (lastThreeRouteBlockDirections.length < 3 || !lastThreeRouteBlockDirections.every((direction) => direction === Direction.UP)) &&
      !currentRouteBlocks.some((block) => block.xIndex == currentRouteBlock.xIndex && block.yIndex === currentRouteBlock.yIndex - 1)
    ) {
      nextBlocks.push({
        yIndex: currentRouteBlock.yIndex - 1,
        xIndex: currentRouteBlock.xIndex,
        heatLoss: city[currentRouteBlock.yIndex - 1][currentRouteBlock.xIndex],
        nextDirection: Direction.UP
      });
    }

    // RIGHT
    if (
      currentRouteBlock.nextDirection !== Direction.LEFT && currentRouteBlock.xIndex < xEndIndex &&
      (lastThreeRouteBlockDirections.length < 3 || !lastThreeRouteBlockDirections.every((direction) => direction === Direction.RIGHT)) &&
      !currentRouteBlocks.some((block) => block.xIndex == currentRouteBlock.xIndex + 1 && block.yIndex === currentRouteBlock.yIndex)
    ) {
      nextBlocks.push({
        yIndex: currentRouteBlock.yIndex,
        xIndex: currentRouteBlock.xIndex + 1,
        heatLoss: city[currentRouteBlock.yIndex][currentRouteBlock.xIndex + 1],
        nextDirection: Direction.RIGHT
      });
    }

    // DOWN
    if (
      currentRouteBlock.nextDirection !== Direction.UP && currentRouteBlock.yIndex < yEndIndex &&
      (lastThreeRouteBlockDirections.length < 3 || !lastThreeRouteBlockDirections.every((direction) => direction === Direction.DOWN)) &&
      !currentRouteBlocks.some((block) => block.xIndex == currentRouteBlock.xIndex && block.yIndex === currentRouteBlock.yIndex + 1)
    ) {
      nextBlocks.push({
        yIndex: currentRouteBlock.yIndex + 1,
        xIndex: currentRouteBlock.xIndex,
        heatLoss: city[currentRouteBlock.yIndex + 1][currentRouteBlock.xIndex],
        nextDirection: Direction.DOWN
      });
    }

    // LEFT
    if (
      currentRouteBlock.nextDirection !== Direction.RIGHT && currentRouteBlock.xIndex > 0 &&
      (lastThreeRouteBlockDirections.length < 3 || !lastThreeRouteBlockDirections.every((direction) => direction === Direction.LEFT)) &&
      !currentRouteBlocks.some((block) => block.xIndex == currentRouteBlock.xIndex - 1 && block.yIndex === currentRouteBlock.yIndex)
    ) {
      nextBlocks.push({
        yIndex: currentRouteBlock.yIndex,
        xIndex: currentRouteBlock.xIndex - 1,
        heatLoss: city[currentRouteBlock.yIndex][currentRouteBlock.xIndex - 1],
        nextDirection: Direction.LEFT
      });
    }

    return nextBlocks;
  }

  // const heatLossOfRoutes = this.calculateHeatLossOfRoutes(possibleRoutes);
  // console.log('heatLossOfRoutes', heatLossOfRoutes);

  // calculateHeatLossOfRoutes(routes: Route[]): number[] {
  //   return routes.map((route: Route) => {
  //     let routeHeatLoss = 0;

  //     route.blocks.forEach((block: Block) => {
  //       routeHeatLoss += block.heatLoss;
  //     });

  //     return routeHeatLoss;
  //   });
  // }

  // for (let yIndex = 0; yIndex <= yEndIndex;) {
  //   for (let xIndex = 0; xIndex <= xEndIndex;) {
  //     routeBlocks.push({
  //       yIndex,
  //       xIndex,
  //       heatLoss: parseInt(cityString?.[yIndex]?.[xIndex], 10),
  //       nextDirection: Direction.RIGHT
  //     });
  //     xIndex++
  //     routeBlocks.push({
  //       yIndex,
  //       xIndex,
  //       heatLoss: parseInt(cityString?.[yIndex]?.[xIndex], 10),
  //       nextDirection: Direction.RIGHT
  //     });
  //     xIndex++;
  //     routeBlocks.push({
  //       yIndex,
  //       xIndex,
  //       heatLoss: parseInt(cityString?.[yIndex]?.[xIndex], 10),
  //       nextDirection: Direction.DOWN
  //     });
  //     yIndex++;
  //     routeBlocks.push({
  //       yIndex,
  //       xIndex,
  //       heatLoss: parseInt(cityString?.[yIndex]?.[xIndex], 10),
  //       nextDirection: Direction.DOWN
  //     });
  //     yIndex++;
  //   }
  // }
}
