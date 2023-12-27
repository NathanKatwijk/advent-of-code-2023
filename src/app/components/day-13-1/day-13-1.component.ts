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
  selector: 'app-day-13-1',
  templateUrl: './day-13-1.component.html',
  styleUrls: ['./day-13-1.component.css']
})
export class Day131Component extends DayComponent implements OnInit {
  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-13/example-input.txt', { responseType: 'text' }).subscribe((data: any) => {
    // this.httpClient.get('assets/day-13/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, -1);
    // console.log('splittedStringList', splittedStringList);

    const mirrorPatterns = this.retrieveMirrorPatterns(splittedStringList);
    // console.log('mirrorPatterns', mirrorPatterns);

    const horizontalReflectionPatterns = this.determineHorizontalReflectionPatterns(mirrorPatterns);
    // console.log('horizontalReflectionPatterns', horizontalReflectionPatterns);

    const verticalMirrorPatterns = this.generateVerticalMirrorPatterns(mirrorPatterns);
    // console.log('verticalMirrorPatterns', verticalMirrorPatterns);

    const verticalReflectionPatterns = this.determineHorizontalReflectionPatterns(verticalMirrorPatterns);
    // console.log('verticalReflectionPatterns', verticalReflectionPatterns);

    this.result = this.calculateResult(horizontalReflectionPatterns, verticalReflectionPatterns);

    // console.log('=====');
    // console.log(`Day 13.1 result: ${this.result}`);
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

// type MirrorPattern = {
//   rows: string[];
//   // columns: string[];
// }

// type ReflectionPattern = {
//   rowsAbove: string[];
//   yStartIndex: number;
//   patternIndex?: number;
//   // rowsBelow: string[]
// }

// type VerticalReflectionPattern = {
//   columnsLeft: string[];
//   xStartIndex: number;
//   // columnsRight: string[]
// }
