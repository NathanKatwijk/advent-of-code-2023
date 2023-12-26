import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayComponent } from '../day/day.component';

type Race = {
  time: number;
  distanceRecord: number;
}

@Component({
  selector: 'app-day-6-2',
  templateUrl: './day-6-2.component.html',
  styleUrls: ['./day-6-2.component.css']
})
export class Day62Component extends DayComponent implements OnInit {
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

    const race = this.retrieveRace(splittedStringList);
    // console.log('race', race);

    this.result = this.calculateResult(race);
    // console.log('=====');
    // console.log(`Day 6.2 result: ${this.result}`);
  }

  retrieveRace(racesString: string[]): Race {
    const raceTime = this.retrieveKernedNumber(racesString[0].substring(11));
    const raceDistanceRecord = this.retrieveKernedNumber(racesString[1].substring(11));

    // console.log('raceTime', raceTime);
    // console.log('raceDistanceRecord', raceDistanceRecord);

    return {
      time: raceTime,
      distanceRecord: raceDistanceRecord,
    };
  }

  retrieveKernedNumber(numberString: string): number {
    return parseInt(numberString.replace(/\s/g, ''), 10);
  }

  calculateResult(race: Race): number {
    let raceNumberOfWaysToWin = 0;
    for (let i = 0; i < race.time; i++) {
      const distanceTraveled = (race.time - i) * i;

      if (distanceTraveled > race.distanceRecord) {
        raceNumberOfWaysToWin++;
      }
    }

    return raceNumberOfWaysToWin;
  }
}
