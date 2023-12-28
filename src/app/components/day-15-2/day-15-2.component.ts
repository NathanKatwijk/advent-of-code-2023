import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

type Lens = {
  label: string;
  operationCharacter: string;
  focalLength?: number;
}

@Component({
  selector: 'app-day-15-2',
  templateUrl: './day-15-2.component.html',
  styleUrls: ['./day-15-2.component.css']
})
export class Day152Component extends DayComponent implements OnInit {
  readonly EQUALS_SIGN = '=';
  readonly DASH_SIGN = '-';

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    // this.httpClient.get('assets/day-15/example-input-2.txt', { responseType: 'text' }).subscribe((data: any) => {
    this.httpClient.get('assets/day-15/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, -1);
    // console.log('splittedStringList', splittedStringList);

    const sequenceSteps = splittedStringList[0].split(',');
    // console.log('sequenceSteps', sequenceSteps);

    const boxes = this.determineBoxes(sequenceSteps);
    // console.log('boxes', boxes);

    this.result = this.calculateResult(boxes);

    // console.log('=====');
    // console.log(`Day 15.2 result: ${this.result}`);
  }

  determineBoxes(sequenceSteps: string[]): Map<number, Lens[]> {
    const boxes = new Map<number, Lens[]>();

    sequenceSteps.forEach((sequenceStep: string) => {
      let operationCharacterIndex = sequenceStep.search(/[-=]/);

      let lens: Lens = {
        label: sequenceStep.slice(0, operationCharacterIndex),
        operationCharacter: sequenceStep.slice(operationCharacterIndex, operationCharacterIndex + 1),
      };
      const boxNumberOfLabel = this.calculateHashAlgoritmValue(lens.label);

      let boxLenses = boxes.get(boxNumberOfLabel) || [];
      if (lens.operationCharacter === this.EQUALS_SIGN) {
        lens.focalLength = parseInt(sequenceStep.slice(operationCharacterIndex + 1), 10);

        const indexOfLens = boxLenses.findIndex((boxLens) => boxLens.label === lens.label);
        if (indexOfLens === -1) {
          boxLenses.push(lens);
        } else {
          boxLenses[indexOfLens] = lens;
        }
      } else { // DASH_SIGN
        boxLenses = boxLenses.filter((boxLens) => boxLens.label !== lens.label);
      }

      if (boxLenses.length > 0) {
        boxes.set(boxNumberOfLabel, boxLenses);
      } else {
        boxes.delete(boxNumberOfLabel);
      }
    });

    return boxes;
  }

  calculateResult(boxes: Map<number, Lens[]>): number {
    let result = 0;

    for (const [key, value] of boxes) {
      const lensFocusingPower = value.reduce((acc: number, lens: Lens, index: number) =>
        acc + ((1 + key) * (index + 1) * Number(lens.focalLength))
      , 0);

      // console.log('lensFocusingPower', lensFocusingPower);
      result += lensFocusingPower;
    };

    return result;
  }

  calculateHashAlgoritmValue(sequenceStep: string): number {
    let currentValue = 0;

    sequenceStep.split('').forEach((stepCharacter: string) => {
      const asciiCode = stepCharacter.charCodeAt(0);

      currentValue = ((currentValue + asciiCode) * 17) % 256;
    });

    return currentValue;
  }
}
