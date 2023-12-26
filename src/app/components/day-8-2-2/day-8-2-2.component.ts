import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayComponent } from '../day/day.component';

type PositionInstruction = {
  currentPosition: string;
  positionOnLeft: string;
  positionOnRight: string;
}

@Component({
  selector: 'app-day-8-2-2',
  templateUrl: './day-8-2-2.component.html',
  styleUrls: ['./day-8-2-2.component.css']
})
export class Day822Component extends DayComponent implements OnInit {
  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-8/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, data.split('\n').length - 1);
    // console.log('splittedStringList', splittedStringList);

    const directionInstructions = Array.from(splittedStringList[0]);
    // console.log('directionInstructions', directionInstructions);

    const positionInstructions = this.retrievePositionInstructions(splittedStringList);
    // console.log('positionInstructions', positionInstructions);

    const startPositions = this.retrieveStartPositions(positionInstructions);
    // console.log('startPositions', startPositions);

    const stepsPerStartPosition = this.retrieveStepsPerStartPosition(directionInstructions, positionInstructions, startPositions);
    // console.log('stepsPerStartPosition', stepsPerStartPosition);

    // Calculation of the result may take several hours
    this.result = this.calculateResult(stepsPerStartPosition);

    // console.log('=====');
    // console.log(`Day 8.2.2 result: ${this.result}`);
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

  retrieveStartPositions(positionInstructions: PositionInstruction[]): string[] {
    return positionInstructions
      .filter((instruction) => instruction.currentPosition.endsWith('A'))
      .map((instruction) => instruction.currentPosition);
  }

  retrieveStepsPerStartPosition(
    directionInstructions: string[],
    positionInstructions: PositionInstruction[],
    startPositions: string[]
  ) {
    return startPositions.map((startPosition: string) =>
      this.calculateStepsForStartingNumber(directionInstructions, positionInstructions, startPosition)
    );
  }

  calculateStepsForStartingNumber(directionInstructions: string[], positionInstructions: PositionInstruction[], startNumber: string): number {
    let currentPosition = startNumber;
    let directionInstructionsIndex = 0;
    let steps = 0;

    while(!currentPosition.endsWith('Z')) {
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

  calculateResult(
    stepsPerStartPosition: number[]
  ): number {
    let sharedStepsPerStartPosition = stepsPerStartPosition;

    while (sharedStepsPerStartPosition.some((stepAmount) => stepAmount !== sharedStepsPerStartPosition[0])) {
      const uncheckedNewSharedStepsPerStartPosition = sharedStepsPerStartPosition.map((stepAmount: number, index: number) => stepAmount + stepsPerStartPosition[index])
      // console.log('uncheckedNewSharedStepsPerStartPosition', uncheckedNewSharedStepsPerStartPosition);

      const checkedSharedStepsPerStartPosition = uncheckedNewSharedStepsPerStartPosition.map((uncheckedStepAmount: number, index: number) => {
        const lowestUncheckedStepAmount = Math.min(...uncheckedNewSharedStepsPerStartPosition);
        if (uncheckedStepAmount > lowestUncheckedStepAmount) {
          return sharedStepsPerStartPosition[index];
        } else {
          return uncheckedStepAmount;
        }
      });
      // console.log('checkedSharedStepsPerStartPosition', checkedSharedStepsPerStartPosition);

      sharedStepsPerStartPosition = checkedSharedStepsPerStartPosition;
    }
    // console.log('sharedStepsPerStartPosition end', sharedStepsPerStartPosition);

    return sharedStepsPerStartPosition[0];
  }
}
