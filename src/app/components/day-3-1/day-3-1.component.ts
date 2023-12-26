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
  selector: 'app-day-3-1',
  templateUrl: './day-3-1.component.html',
  styleUrls: ['./day-3-1.component.css']
})
export class Day31Component extends DayComponent implements OnInit {
  readonly SPECIAL_CHARACTERS = '!@#$%^&*()_+-=[]{};\':"|<>/?'.split('');
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
    // console.log(`Day 3.1 result: ${this.result}`);
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

    numbersInSchematic.forEach((numbersInSchematicRow) => {
      numbersInSchematicRow.forEach((numberObject) => {
        let isPartNumber = false;

        const specialCharactersRowMinusOne = specialCharactersInSchematic.find((row) => row[0].rowIndex === numberObject.rowIndex - 1);
        const specialCharactersRow = specialCharactersInSchematic.find((row) => row[0].rowIndex === numberObject.rowIndex);
        const specialCharactersRowPlusOne = specialCharactersInSchematic.find((row) => row[0].rowIndex === numberObject.rowIndex + 1);

        if (specialCharactersRowMinusOne) {
          isPartNumber = specialCharactersRowMinusOne.some((row) =>
            (row.columnInRowIndex >= numberObject.startColumnInRowIndex - 1) &&
            (row.columnInRowIndex <= numberObject.endColumnInRowIndex + 1)
          );
        }
        if (specialCharactersRow && !isPartNumber) {
          isPartNumber = specialCharactersRow.some((row) =>
            (row.columnInRowIndex === numberObject.startColumnInRowIndex - 1) ||
            (row.columnInRowIndex === numberObject.endColumnInRowIndex + 1)
          );
        }
        if (specialCharactersRowPlusOne && !isPartNumber) {
          isPartNumber = specialCharactersRowPlusOne.some((row) =>
            (row.columnInRowIndex >= numberObject.startColumnInRowIndex - 1) &&
            (row.columnInRowIndex <= numberObject.endColumnInRowIndex + 1)
          );
        }

        if(isPartNumber) {
          // console.log(`[${numberObject.rowIndex + 1}] isPartNumber TRUE`, result, numberObject.numberCharacters);
          result = result + parseInt(numberObject.numberCharacters);
        } else {
          // console.log(`[${numberObject.rowIndex + 1}] isPartNumber FALSE`, result, numberObject.numberCharacters);
        }
      });
    });

    return result;
  }
}

// Useful regex for the special characters: ^([!@#$%^&*()_+\-=\[\]{};':"\\|<>\/?])+$

// const splittedStringList = data.split('\n').slice(0, 10); // TEMP!
// const splittedStringList = data.split('\n').slice(0, 2); // TEMP;
