import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayComponent } from '../day/day.component';

@Component({
  selector: 'app-day-2-2',
  templateUrl: './day-2-2.component.html',
  styleUrls: ['./day-2-2.component.css']
})
export class Day22Component extends DayComponent implements OnInit {

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

    const gamesMetaData = games.map((game) => {
      let minimalRed = 0;
      let minimalGreen = 0;
      let minimalBlue = 0;

      game.gameLegs.forEach((gameLeg) => {
        if (gameLeg.red > minimalRed) {
          minimalRed = gameLeg.red;
        }
        if (gameLeg.green > minimalGreen) {
          minimalGreen = gameLeg.green;
        }
        if (gameLeg.blue > minimalBlue) {
          minimalBlue = gameLeg.blue;
        }
      });

      return {
        gameNumber: game.gameNumber,
        minimalCubes: {
          minimalRed,
          minimalGreen,
          minimalBlue
        }
      };
    });

    this.result = gamesMetaData.reduce((acc: number, gameMetaData) => {
      return acc + (
        gameMetaData.minimalCubes.minimalRed *
        gameMetaData.minimalCubes.minimalGreen *
        gameMetaData.minimalCubes.minimalBlue
      );
    }, 0);

    // console.log('=====');
    // console.log(`Day 2.2 result: ${this.result}`);
  }
}
