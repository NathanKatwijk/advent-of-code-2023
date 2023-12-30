import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';
import { Dijkstra } from './dijkstra';

@Component({
  selector: 'app-day-17-1-2',
  templateUrl: './day-17-1-2.component.html',
  styleUrls: ['./day-17-1-2.component.css']
})
export class Day1712Component extends DayComponent implements OnInit {
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
    console.log('city', city);

    const graph = this.generateDijkstraGraph(city);
    console.log('graph', graph);

    const shortestPath = this.retrieveShortestPath(city, graph);
    console.log('shortestPath', shortestPath);

    this.result = this.calculateResult(city, shortestPath);

    console.log('=====');
    console.log(`Day 17.1 result: ${this.result}`);
  }

  retrieveCity(cityString: string[]): number[][] {
    return cityString.map((cityRowString: string) =>
      cityRowString.split('').map((cityBlock: string) => parseInt(cityBlock, 10))
    );
  }

  generateDijkstraGraph(city: number[][]): Dijkstra {
    const graph = new Dijkstra();

    city.forEach((cityRow: number[], yIndex: number) => {
      cityRow.forEach((_, xIndex: number) => {
        const blockUp = city?.[yIndex - 1]?.[xIndex];
        const blockRight = cityRow[xIndex + 1];
        const blockDown = city?.[yIndex + 1]?.[xIndex];
        const blockLeft = cityRow[xIndex - 1];

        let edges: any = {};
        if (blockUp !== undefined) {
          edges[`${yIndex - 1},${xIndex}`] = blockUp;
        }
        if (blockRight !== undefined) {
          edges[`${yIndex},${xIndex + 1}`] = blockRight;
        }
        if (blockDown !== undefined) {
          edges[`${yIndex + 1},${xIndex}`] = blockDown;
        }
        if (blockLeft !== undefined) {
          edges[`${yIndex},${xIndex - 1}`] = blockLeft;
        }

        graph.addVertex(`${yIndex},${xIndex}`, edges);
      });
    });

    return graph;
  }

  retrieveShortestPath(city: number[][], graph: Dijkstra): string[] {
    const yEndIndex = city.length - 1;
    const xEndIndex = city[0].length - 1;
    const endPoint = `${yEndIndex},${xEndIndex}`;
    const startPoint = '0,0';

    return graph.shortestPath(startPoint, endPoint);
  }

  calculateResult(city: number[][], shortestPath: string[]): number {
    return shortestPath.reduce((acc: number, pathStep: string, index: number) => {
      const yIndex = parseInt(pathStep.substring(0, pathStep.indexOf(',')));
      const xIndex = parseInt(pathStep.substring(pathStep.indexOf(',') + 1));
      // console.log('add to result', city[yIndex][xIndex]);
      return acc + (index > 0 ? city[yIndex][xIndex] : 0);
    }, 0);
  }
}
