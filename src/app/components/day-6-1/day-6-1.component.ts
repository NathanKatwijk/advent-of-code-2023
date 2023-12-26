import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayComponent } from '../day/day.component';

type Race = {
  time: number;
  distanceRecord: number;
}

@Component({
  selector: 'app-day-6-1',
  templateUrl: './day-6-1.component.html',
  styleUrls: ['./day-6-1.component.css']
})
export class Day61Component extends DayComponent implements OnInit {
  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-6/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    const splittedStringList = data.split('\n').slice(0, data.split('\n').length - 1);
    // console.log('splittedStringList', splittedStringList);

    const races = this.retrieveRaces(splittedStringList);
    // console.log('races', races);

    this.result = this.calculateResult(races);
    // console.log('=====');
    // console.log(`Day 6.1 result: ${this.result}`);
  }

  retrieveRaces(racesString: string[]): Race[] {
    const raceTimes = this.retrieveNumbers(racesString[0].substring(11));
    const raceDistanceRecords = this.retrieveNumbers(racesString[1].substring(11));

    // console.log('raceTimes', raceTimes);
    // console.log('raceDistanceRecords', raceDistanceRecords);

    return raceTimes.map((raceTime: number, index: number) => ({
      time: raceTime,
      distanceRecord: raceDistanceRecords[index]
    }));
  }

  retrieveNumbers(numbersString: string): number[] {
    return numbersString
      .substring(numbersString.indexOf(':')+1)
      .trim()
      .split(/\s+/)
      .map((numberString: string) => parseInt(numberString.trim(), 10));
  }

  calculateResult(races: Race[]): number {
    const result = races.reduce((acc: number, race: Race) => {
      const raceNumberOfWaysToWin = this.calculateRaceNumberOfWaysToWin(race);

      if (acc === 0) {
        return raceNumberOfWaysToWin;
      } else {
        return acc * raceNumberOfWaysToWin;
      }
    }, 0);

    return result;
  }

  calculateRaceNumberOfWaysToWin(race: Race): number {
    let result = 0;
    for (let i = 0; i < race.time; i++) {
      const distanceTraveled = (race.time - i) * i;

      if (distanceTraveled > race.distanceRecord) {
        result++;
      }
    }

    return result;
  }
}
