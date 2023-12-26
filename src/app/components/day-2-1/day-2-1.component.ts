import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayComponent } from '../day/day.component';

@Component({
  selector: 'app-day-2-1',
  templateUrl: './day-2-1.component.html',
  styleUrls: ['./day-2-1.component.css']
})
export class Day21Component extends DayComponent implements OnInit {
  readonly MAX_RED_CUBES = 12;
  readonly MAX_GREEN_CUBES = 13;
  readonly MAX_BLUE_CUBES = 14;

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-2/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    const splittedStringList = data.split('\n').slice(0, 100);

    const games = splittedStringList.map((splittedString: string, index: number) => {
      const gameResults = splittedString.slice(splittedString.indexOf(':')+1).trim().split(';');

      return {
        gameNumber: index + 1,
        gameLegs: gameResults.map((gameString) => {
          let gameLegResults = gameString.trim().split(',').map((gameLegResult) => (gameLegResult.trim()));

          if(gameString.trim().indexOf(',') === -1) {
            gameLegResults = [ gameString.trim() ];
          }

          let red = 0;
          let green = 0;
          let blue = 0;

          gameLegResults.forEach((gameLegResult: string) => {
            if(gameLegResult.includes('red')) {
              // @ts-ignore
              red = parseInt(gameLegResult.match(/[0-9]+/)[0]);
            } else if(gameLegResult.includes('green')) {
              // @ts-ignore
              green = parseInt(gameLegResult.match(/[0-9]+/)[0]);
            } else if(gameLegResult.includes('blue')) {
              // @ts-ignore
              blue = parseInt(gameLegResult.match(/[0-9]+/)[0]);
            }
          });

          return {
            red,
            green,
            blue
          };
        })
      };
    });

    const filteredGames = games.filter((game) =>
      game.gameLegs.every((gameLeg) => (
        gameLeg.red <= this.MAX_RED_CUBES && gameLeg.green <= this.MAX_GREEN_CUBES && gameLeg.blue <= this.MAX_BLUE_CUBES
      ))
    );

    this.result = filteredGames.reduce((acc: number, { gameNumber }) => (acc + gameNumber), 0);
    // console.log('=====');
    // console.log(`Day 2.1 result: ${this.result}`);
  }
}
