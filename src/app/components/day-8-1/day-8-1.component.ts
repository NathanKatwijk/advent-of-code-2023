import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayComponent } from '../day/day.component';

type PositionInstruction = {
  currentPosition: string;
  positionOnLeft: string;
  positionOnRight: string;
}

@Component({
  selector: 'app-day-8-1',
  templateUrl: './day-8-1.component.html',
  styleUrls: ['./day-8-1.component.css']
})
export class Day81Component extends DayComponent implements OnInit {
  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-8/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    const splittedStringList = data.split('\n').slice(0, data.split('\n').length - 1);
    // console.log('splittedStringList', splittedStringList);

    const directionInstructions = Array.from(splittedStringList[0]);
    // console.log('directionInstructions', directionInstructions);

    const positionInstructions = this.retrievePositionInstructions(splittedStringList);
    // console.log('positionInstructions', positionInstructions);

    this.result = this.calculateResult(directionInstructions, positionInstructions);

    // console.log('=====');
    // console.log(`Day 8.1 result: ${this.result}`);
  }

  retrievePositionInstructions(splittedStringList: string[]): PositionInstruction[] {
    const positionInstructions = splittedStringList
      .filter((row: string) => row.includes('='))
      .map((positionString: string) => ({
        currentPosition: positionString.substring(0, positionString.indexOf('=')-1),
        positionOnLeft: positionString.substring(positionString.indexOf('(')+1, positionString.indexOf(',')),
        positionOnRight: positionString.substring(positionString.indexOf(',')+2, positionString.indexOf(')'))
      }));

    return positionInstructions;
  }

  calculateResult(directionInstructions: string[], positionInstructions: PositionInstruction[]): number {
    const finalPosition = 'ZZZ';
    let currentPosition = 'AAA';
    let directionInstructionsIndex = 0;
    let steps = 0;

    while(currentPosition !== finalPosition) {
      steps++;

      const positionInstruction = positionInstructions.find((instruction) => instruction.currentPosition === currentPosition);
      const directionInstruction = directionInstructions[directionInstructionsIndex];
      // console.log(`Step ${steps} start`, { currentPosition, positionInstruction, directionInstruction, directionInstructionsIndex});

      if (directionInstruction === 'L') {
        // @ts-ignore
        currentPosition = positionInstruction.positionOnLeft;
      } else {
        // @ts-ignore
        currentPosition = positionInstruction.positionOnRight;
      }

      if (directionInstructions.length === directionInstructionsIndex + 1) {
        directionInstructionsIndex = 0;
      } else {
        directionInstructionsIndex++;
      }

      // console.log(`Step ${steps} end`, { currentPosition, directionInstructionsIndex});
      // console.log(' ')
    }

    return steps;
  }
}
