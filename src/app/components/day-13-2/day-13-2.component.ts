import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

type MirrorPattern = {
  rows: string[];
}

type ReflectionPattern = {
  rowsAbove: string[];
  yStartIndex: number;
  patternIndex?: number;
}

@Component({
  selector: 'app-day-13-2',
  templateUrl: './day-13-2.component.html',
  styleUrls: ['./day-13-2.component.css']
})
export class Day132Component extends DayComponent implements OnInit {
  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    // this.httpClient.get('assets/day-13/example-input.txt', { responseType: 'text' }).subscribe((data: any) => {
    this.httpClient.get('assets/day-13/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, -1);
    // console.log('splittedStringList', splittedStringList);

    const mirrorPatterns = this.retrieveMirrorPatterns(splittedStringList);
    // console.log('mirrorPatterns', mirrorPatterns);

    const excludedHorizontalReflectionPatterns = this.determineHorizontalReflectionPatterns(mirrorPatterns);
    // console.log('excludedHorizontalReflectionPatterns', excludedHorizontalReflectionPatterns);

    const verticalMirrorPatterns = this.generateVerticalMirrorPatterns(mirrorPatterns);
    // console.log('verticalMirrorPatterns', verticalMirrorPatterns);

    const excludedVerticalReflectionPatterns = this.determineHorizontalReflectionPatterns(verticalMirrorPatterns);
    // console.log('excludedVerticalReflectionPatterns', excludedVerticalReflectionPatterns);

    const horizontalReflectionPatterns: ReflectionPattern[] = this.determineReflectionPatternsWithoutSmudge(mirrorPatterns, excludedHorizontalReflectionPatterns);
    const verticalReflectionPatterns: ReflectionPattern[] = this.determineReflectionPatternsWithoutSmudge(verticalMirrorPatterns, excludedVerticalReflectionPatterns);

    this.result = this.calculateResult(horizontalReflectionPatterns, verticalReflectionPatterns);

    // console.log('=====');
    // console.log(`Day 13.2 result: ${this.result}`);
  }

  retrieveMirrorPatterns(mirrorPatternsInput: string[]): MirrorPattern[] {
    const mirrorPatterns = [];
    let currentMirrorPattern: MirrorPattern = {
      rows: [],
      // columns: [],
    };

    mirrorPatternsInput.forEach((mirrorPatternInput: string) => {
      if (mirrorPatternInput === "") {
        mirrorPatterns.push(currentMirrorPattern);

        currentMirrorPattern = {
          rows: [],
          // columns: [],
        };
      } else {
        currentMirrorPattern.rows.push(mirrorPatternInput);
      }
    });
    mirrorPatterns.push(currentMirrorPattern);

    return mirrorPatterns;
  }

  determineHorizontalReflectionPatterns(mirrorPatterns: MirrorPattern[]): ReflectionPattern[] {
    const horizontalReflectionPatterns: ReflectionPattern[] = [];

    mirrorPatterns.forEach((mirrorPattern: MirrorPattern, patternIndex: number) => {
      mirrorPattern.rows.forEach((row: string, rowIndex: number) => {
        if (rowIndex > 0) {
          const horizontalReflectionPattern = this.compareVerticalMirrorPatternRows(mirrorPattern.rows, rowIndex);
          // console.log(`[${patternIndex}][${rowIndex}] horizontalReflectionPattern`, horizontalReflectionPattern);

          if (horizontalReflectionPattern.rowsAbove.length > 0) {
            horizontalReflectionPatterns.push({
              ...horizontalReflectionPattern,
              patternIndex,
            });
          }
        }
      });
    });

    return horizontalReflectionPatterns;
  }

  compareVerticalMirrorPatternRows(mirrorPatternRows: string[], startIndex: number): ReflectionPattern {
    const horizontalReflectionPattern: ReflectionPattern = {
      rowsAbove: [],
      yStartIndex: startIndex,
    }

    const amountOfMirrorPatternRows = mirrorPatternRows.length;
    let comparisonIsFinished = false;
    let indexDelta = 0;

    while (!comparisonIsFinished) {
      const previousIndex = startIndex - indexDelta - 1;
      const nextIndex = startIndex + indexDelta;

      if (previousIndex < 0 || nextIndex === amountOfMirrorPatternRows) {
        if (indexDelta > 0) {
          horizontalReflectionPattern.rowsAbove = mirrorPatternRows.slice(0, startIndex);
        }

        comparisonIsFinished = true;
      }

      const previousMirrorPattern = mirrorPatternRows[previousIndex];
      const nextMirrorPattern = mirrorPatternRows[nextIndex];

      if (previousMirrorPattern === nextMirrorPattern) {
        indexDelta++;
      } else {
        comparisonIsFinished = true;
      }
    }

    return horizontalReflectionPattern;
  }

  generateVerticalMirrorPatterns(mirrorPatterns: MirrorPattern[]): MirrorPattern[] {
    const verticalMirrorPatterns: MirrorPattern[] = Array.from({ length: mirrorPatterns.length }, () => ({
      rows: [],
    }));

    mirrorPatterns.forEach((mirrorPattern: MirrorPattern, index: number) => {
      const amountOfColumns = mirrorPattern.rows[0].length;

      for (let columnIndex = 0; columnIndex < amountOfColumns; columnIndex++) {
        const mirrorPatternColumn = mirrorPattern.rows.map((mirrorPatternRow) => mirrorPatternRow[columnIndex]);
        // console.warn('mirrorPatternColumn', mirrorPatternColumn);

        verticalMirrorPatterns[index].rows.push(mirrorPatternColumn.join(''));
      }
    })

    return verticalMirrorPatterns;
  }

  determineReflectionPatternsWithoutSmudge(mirrorPatterns: MirrorPattern[], excludedReflectionPatterns: ReflectionPattern[]): ReflectionPattern[] {
    const horizontalReflectionPatternsWithoutSmudge: ReflectionPattern[] = [];

    mirrorPatterns.forEach((mirrorPattern: MirrorPattern, patternIndex: number) => {
      const currentExcludedReflectionPatterns = excludedReflectionPatterns.filter((pattern) => pattern.patternIndex === patternIndex);
      // console.log('');
      // console.log('  currentExcludedReflectionPatterns', currentExcludedReflectionPatterns);
      const currentExcludedYIndices = currentExcludedReflectionPatterns.map((pattern) => pattern.yStartIndex);

      let newHorizontalReflectionPatternWithoutSmudge: ReflectionPattern[] = [];
      // console.log('');

      let breakLoop = false;
      for (let yIndex = 0; yIndex < mirrorPattern.rows.length; yIndex++) {
        if (breakLoop) {
          break;
        }
        // console.log(`  [p: ${patternIndex}][y: ${yIndex}]`);

        const currentMirrorPattern = mirrorPattern.rows[yIndex];
        for (let xIndex = 0; xIndex < currentMirrorPattern.length; xIndex++) {
          const flippedCharacter = currentMirrorPattern[xIndex] === '.' ? '#' : '.';
          // console.log(`  [p: ${patternIndex}][y: ${yIndex}][x: ${xIndex}]`);

          const newMirrorPattern: MirrorPattern = {
            rows: [
              ...mirrorPattern.rows.slice(0, yIndex),
              (
                currentMirrorPattern.slice(0, xIndex) + flippedCharacter + currentMirrorPattern.slice(xIndex + 1)
              ),
              ...mirrorPattern.rows.slice(yIndex + 1),
            ],
          };
          // console.log('  newMirrorPattern', newMirrorPattern);

          const foundReflectionPatterns = this.determineHorizontalReflectionPatterns([newMirrorPattern]);
          // console.log('    foundReflectionPatterns', foundReflectionPatterns);

          const filteredFoundReflectionPatterns = foundReflectionPatterns.filter((pattern) => !currentExcludedYIndices.includes(pattern.yStartIndex));

          if (filteredFoundReflectionPatterns.length > 0) {
            // console.log('    filteredFoundReflectionPatterns', filteredFoundReflectionPatterns);

            newHorizontalReflectionPatternWithoutSmudge.push(filteredFoundReflectionPatterns[0]);
            breakLoop = true;
            break;
          }
        }
      }

      // console.log('    > Add to list: ', newHorizontalReflectionPatternWithoutSmudge);
      if (newHorizontalReflectionPatternWithoutSmudge.length > 0) {
        horizontalReflectionPatternsWithoutSmudge.push(...newHorizontalReflectionPatternWithoutSmudge);
      }
    });

    // console.log('');
    // console.log('  horizontalReflectionPatternsWithoutSmudge', horizontalReflectionPatternsWithoutSmudge);
    return horizontalReflectionPatternsWithoutSmudge;
  }

  calculateResult(horizontalReflectionPatterns: ReflectionPattern[], verticalReflectionPatterns: ReflectionPattern[]): number {
    const horizontalResult = horizontalReflectionPatterns.reduce((acc: number, horizontalReflectionPattern: ReflectionPattern) =>
      (acc + horizontalReflectionPattern.rowsAbove.length * 100)
    , 0);
    // console.log('horizontalResult', horizontalResult);

    const verticalResult = verticalReflectionPatterns.reduce((acc: number, verticalReflectionPattern: ReflectionPattern) =>
      (acc + (verticalReflectionPattern.rowsAbove.length))
    , 0);
    // console.log('verticalResult', verticalResult);

    return horizontalResult + verticalResult;
  };
}
