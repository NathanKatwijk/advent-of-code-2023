import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayComponent } from '../day/day.component';

type SchematicSpecialCharacter = {
  rowIndex: number,
  columnInRowIndex: number,
  character: string,
}

type SchematicNumbers = {
  rowIndex: number,
  startColumnInRowIndex: number,
  endColumnInRowIndex: number,
  numberCharacters: string,
}

@Component({
  selector: 'app-day-3-2',
  templateUrl: './day-3-2.component.html',
  styleUrls: ['./day-3-2.component.css']
})
export class Day32Component extends DayComponent implements OnInit {
  readonly SPECIAL_CHARACTERS = '*'.split('');
  readonly NUMBERS = '0123456789'.split('');

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-3/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    const splittedStringList = data.split('\n').slice(0, 140);
    const schematic = splittedStringList.map((stringRow) => stringRow.split(''));
    // console.log('schematic', schematic);

    const specialCharactersInSchematic: SchematicSpecialCharacter[][] = this.retrieveSpecialCharactersInSchematic(schematic);
    // console.log('specialCharactersInSchematic', specialCharactersInSchematic);

    const numbersInSchematic: SchematicNumbers[][] = this.retrieveNumbersInSchematic(schematic);
    // console.log('numbersInSchematic', numbersInSchematic);

    this.result = this.retrieveResult(specialCharactersInSchematic, numbersInSchematic);
    // console.log('=====');
    // console.log(`Day 3.2 result: ${this.result}`);
  }

  private retrieveSpecialCharactersInSchematic(schematic: string[][]): SchematicSpecialCharacter[][] {
    let newSpecialCharactersInSchematic: SchematicSpecialCharacter[][] = [];
    schematic.forEach((schematicRow: string[], rowIndex: number) => {
      let newSchematicsRow: SchematicSpecialCharacter[] = [];
      schematicRow.forEach((character: string, columnInRowIndex: number) => {
        if (this.SPECIAL_CHARACTERS.includes(character)) {
          newSchematicsRow.push({
            rowIndex,
            columnInRowIndex,
            character,
          });
        }
      });

      if(newSchematicsRow.length > 0) {
        newSpecialCharactersInSchematic.push(newSchematicsRow);
      }
    });

    return newSpecialCharactersInSchematic;
  }

  private retrieveNumbersInSchematic(schematic: string[][]): SchematicNumbers[][] {
    let newNumbersInSchematic: SchematicNumbers[][] = [];
    schematic.forEach((schematicRow: string[], rowIndex: number) => {

      let newSchematicsRow: SchematicNumbers[] = [];
      schematicRow.forEach((numberCharacter: string, columnInRowIndex: number) => {

        if (this.NUMBERS.includes(numberCharacter)) {
          if(this.NUMBERS.includes(schematic[rowIndex][columnInRowIndex - 1])) {
            const lastItem = newSchematicsRow.pop();

            newSchematicsRow.push({
              // @ts-ignore
              rowIndex: lastItem?.rowIndex,
              // @ts-ignore
              startColumnInRowIndex: lastItem?.startColumnInRowIndex,
              endColumnInRowIndex: columnInRowIndex,
              numberCharacters: lastItem?.numberCharacters + numberCharacter,
            });
          } else {
            newSchematicsRow.push({
              rowIndex,
              startColumnInRowIndex: columnInRowIndex,
              endColumnInRowIndex: columnInRowIndex,
              numberCharacters: numberCharacter,
            });
          }
        }
      });

      if(newSchematicsRow.length > 1) {
        newNumbersInSchematic.push(newSchematicsRow);
      }
    });

    return newNumbersInSchematic;
  }

  private retrieveResult(
    specialCharactersInSchematic: SchematicSpecialCharacter[][],
    numbersInSchematic: SchematicNumbers[][]
  ): number {
    let result = 0;

    specialCharactersInSchematic.forEach((specialCharactersInRow) => {
      specialCharactersInRow.forEach((specialCharacter) => {
        // console.log(`[${specialCharacter.rowIndex + 1}] specialCharacter`, specialCharacter)
        let gearRatio = 0;
        let amountOfMatchingPartNumbers = 0;

        const numberCharactersRowMinusOne = numbersInSchematic.find((row) => row[0].rowIndex === specialCharacter.rowIndex - 1);
        const numberCharactersRow = numbersInSchematic.find((row) => row[0].rowIndex === specialCharacter.rowIndex);
        const numberCharactersRowPlusOne = numbersInSchematic.find((row) => row[0].rowIndex === specialCharacter.rowIndex + 1);

        if (numberCharactersRowMinusOne) {
          const matchingPartNumbers = numberCharactersRowMinusOne.filter((numberObject) =>
            (specialCharacter.columnInRowIndex == numberObject.endColumnInRowIndex - 1) ||
            (specialCharacter.columnInRowIndex == numberObject.endColumnInRowIndex) ||
            (specialCharacter.columnInRowIndex == numberObject.endColumnInRowIndex + 1) ||
            (specialCharacter.columnInRowIndex == numberObject.startColumnInRowIndex - 1) ||
            (specialCharacter.columnInRowIndex == numberObject.startColumnInRowIndex) ||
            (specialCharacter.columnInRowIndex == numberObject.startColumnInRowIndex + 1)
          );

          if(matchingPartNumbers?.length > 0) {
            const gearRatioOfGear = this.calculateGearRatioOfGear(matchingPartNumbers);
            if (gearRatio === 0) {
              gearRatio = gearRatioOfGear;
            } else {
              gearRatio *= gearRatioOfGear;
            }

            amountOfMatchingPartNumbers = amountOfMatchingPartNumbers + matchingPartNumbers.length;
          }
          // console.log(`[${specialCharacter.rowIndex + 1}] numberCharactersRowMinusOne matchingPartNumbers`, matchingPartNumbers, gearRatio);
        }

        if (numberCharactersRow) {
          const matchingPartNumbers = numberCharactersRow.filter((numberObject) =>
            (specialCharacter.columnInRowIndex === numberObject.endColumnInRowIndex + 1) ||
            (specialCharacter.columnInRowIndex === numberObject.startColumnInRowIndex -1)
          );

          if(matchingPartNumbers?.length > 0) {
            const gearRatioOfGear = this.calculateGearRatioOfGear(matchingPartNumbers);
            if (gearRatio === 0) {
              gearRatio = gearRatioOfGear;
            } else {
              gearRatio *= gearRatioOfGear;
            }

            amountOfMatchingPartNumbers = amountOfMatchingPartNumbers + matchingPartNumbers.length;
          }
          // console.log(`[${specialCharacter.rowIndex + 1}] numberCharactersRow matchingPartNumbers`, matchingPartNumbers, gearRatio);
        }

        if (numberCharactersRowPlusOne) {
          const matchingPartNumbers = numberCharactersRowPlusOne.filter((numberObject) =>
            (specialCharacter.columnInRowIndex == numberObject.endColumnInRowIndex - 1) ||
            (specialCharacter.columnInRowIndex == numberObject.endColumnInRowIndex) ||
            (specialCharacter.columnInRowIndex == numberObject.endColumnInRowIndex + 1) ||
            (specialCharacter.columnInRowIndex == numberObject.startColumnInRowIndex - 1) ||
            (specialCharacter.columnInRowIndex == numberObject.startColumnInRowIndex) ||
            (specialCharacter.columnInRowIndex == numberObject.startColumnInRowIndex + 1)
          );

          if(matchingPartNumbers?.length > 0) {
            const gearRatioOfGear = this.calculateGearRatioOfGear(matchingPartNumbers);
            if (gearRatio === 0) {
              gearRatio = gearRatioOfGear;
            } else {
              gearRatio *= gearRatioOfGear;
            }

            amountOfMatchingPartNumbers = amountOfMatchingPartNumbers + matchingPartNumbers.length;
          }
          // console.log(`[${specialCharacter.rowIndex + 1}] numberCharactersRowPlusOne matchingPartNumbers`, matchingPartNumbers, gearRatio);
        }

        // console.log(`[${specialCharacter.rowIndex + 1}] amountOfMatchingPartNumbers`, amountOfMatchingPartNumbers);
        let isGear = amountOfMatchingPartNumbers === 2;
        if(isGear) {
          result = result + gearRatio;
        }
        // console.log(`[${specialCharacter.rowIndex + 1}] isGear ${isGear}`, result, gearRatio);
      });
    })

    return result;
  }

  private calculateGearRatioOfGear(partNumbers: SchematicNumbers[]): number {
    return partNumbers.reduce((acc, partNumber) => {
      if(acc === 0) {
        return parseInt(partNumber.numberCharacters, 10);
      } else {
        return acc * parseInt(partNumber.numberCharacters, 10);
      }
    }, 0);
  }
}

// Useful regex for the special characters: ^([!@#$%^&*()_+\-=\[\]{};':"\\|<>\/?])+$

// const splittedStringList = data.split('\n').slice(0, 10); // TEMP!
// const splittedStringList = data.split('\n').slice(0, 2); // TEMP;
