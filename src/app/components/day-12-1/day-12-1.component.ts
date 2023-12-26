import { Component, OnInit } from '@angular/core';
import { DayComponent } from '../day/day.component';
import { HttpClient } from '@angular/common/http';

type SpringRow = {
  conditions: string[];
  conditionsString: string;
  damagedSprings: number[];
  arrangements?: number;
}

@Component({
  selector: 'app-day-12-1',
  templateUrl: './day-12-1.component.html',
  styleUrls: ['./day-12-1.component.css']
})
export class Day121Component extends DayComponent implements OnInit {
  readonly SPRING_OPERATIONAL = '.';
  readonly SPRING_DAMAGED = '#';
  readonly SPRING_UNKNOWN = '?';

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-12/example-input-2.txt', { responseType: 'text' }).subscribe((data: any) => {
    // this.httpClient.get('assets/day-12/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    // console.log(' ');
    const splittedStringList = data.split('\n').slice(0, -1);
    // console.log('splittedStringList', splittedStringList);

    const springRows = this.retrieveSpringRows(splittedStringList);
    // console.log('springRows', springRows);

    this.result = this.determinePossibleArrangements(springRows);

    // console.log('=====');
    // console.log(`Day 12.1 result: ${this.result}`);
  }

  retrieveSpringRows(springInput: string[]): SpringRow[] {
    return springInput.map((springRowInput) => ({
      conditions: springRowInput
        .substring(0, springRowInput.indexOf(' '))
        .split(''),
      conditionsString: springRowInput
        .substring(0, springRowInput.indexOf(' ')),
      damagedSprings: springRowInput
        .substring(springRowInput.indexOf(' ')+1)
        .split(',')
        .map((numberString: string) => parseInt(numberString.trim(), 10))
    }));
  }

  determinePossibleArrangements(springRows: SpringRow[]): number {
    let possibleArrangements = 0;

    springRows.forEach((springRow: SpringRow, springRowIndex: number) => {
      // console.log('');
      // console.log(`[${springRowIndex}]`);
      // console.log('  > input conditions string', springRow.conditionsString);

      const springRegularExpression = this.generateSpringRowRegex(springRow.damagedSprings);

      const inputs = this.generateInputs(springRow.conditionsString);

      const arrangements = this.getAmountOfMatchingArrangements(springRow.conditionsString, springRegularExpression, inputs, springRow.damagedSprings);

      // console.log(`[${springRowIndex}] amountOfMatchingArrangements: `, arrangements);
      possibleArrangements = possibleArrangements + arrangements;
    });

    return possibleArrangements;
  }

  generateSpringRowRegex(damagedSprings: number[]): RegExp {
    const regexParts = damagedSprings.map((damagedSpringsAmount: number, index: number) => {
      let regexPart = '';

      if (index > 0) {
        if (index === damagedSprings.length - 1) {
          regexPart = '([.\?]+)';
        } else {
          regexPart = '([.\?]+?)';
        }
      }
      regexPart += `([\?#]{${damagedSpringsAmount}})`;

      return regexPart;
    });

    const regex = new RegExp(regexParts.toString().replaceAll(',', ''));
    // console.log('regex', regex);

    return regex;
  }

  getAmountOfMatchingArrangements(inputStringMatch: string, springRegularExpression: RegExp, inputStrings: string[], damagedSprings: number[]): number {
    const matches: string[] = [];
    const inputStringMatchAmountOfDots = inputStringMatch.split('.').length - 1;
    const amountOfDamagedSprings = damagedSprings.reduce((acc, value) => acc + value, 0);
    // console.log('getAmountOfMatchingArrangements input', { inputString: inputStringMatch, springRegularExpression, inputStrings, amountOfDamagedSprings });

    inputStrings.forEach((inputString: string) => {
      const isSameOrHigherAmountOfDots = inputString.split('.').length - 1 >= inputStringMatchAmountOfDots;
      const isSameAmountOfHashes = inputString.split('#').length - 1 === amountOfDamagedSprings;

      if (
        isSameOrHigherAmountOfDots &&
        isSameAmountOfHashes &&
        inputStringMatch.split('').every((character: string, index: number) => character === '?' || inputString[index] === character)
      ) {
        const regexResult = springRegularExpression.exec(inputString);
        if (regexResult !== null) {
          matches.push(inputString);
        }
      }
    });

    // console.log('  > matches', matches);
    return matches.length;
  }

  generateInputs(matchString: string): string[] {
    const inputs: string[] = [];

    populateArray(matchString.length, "");

    function populateArray(n: number, str: string) {
      if (str.length === n) {
        inputs.push(str);
      } else {
        populateArray(n, str + ".");
        populateArray(n, str + "#");
      }
    }

    return inputs;
  }
}

// Poging 1
/*
  const input =
    // first - blijft gelijk
    // groups[0] +
    // updatedGroupSeparators[0] +
    // tussen first en current
    this.generateSpringRow(
      groups.slice(0, index),
      updatedGroupSeparators.slice(0, index),
    ) +
    // current
    currentGroup +
    currentGroupSeparator + currentCutOffGroupSeparator.substring(cutOffPointInLastGroupSep) +
    // tussen current en last
    this.generateSpringRow(
      groups.slice(1+index, -1),
      updatedGroupSeparators.slice(1+index, -1),
    ) +
    // last - blijft gelijk
    currentCutOffGroup +
    currentCutOffGroupSeparator.substring(0, cutOffPointInLastGroupSep)
  ;
*/

// POGING 2
// // const updatedGroupSeparators = this.updateGroupSeparators(groupSeparators).map((sep) => sep.replaceAll('?', '.'));
// // const updatedGroupSeparators = this.updateGroupSeparators(groupSeparators); // .map((sep) => sep.replaceAll('?', '.'));
// const updatedGroups = regexResult?.slice(1).filter((_, index) => index % 2 === 0) ?? []; // .map((group) => group.replaceAll('?', '#')) ?? [];
// const updatedGroupSeparators = [ ...groupSeparators, '']; // [...groupSeparators.map((sep) => sep.replaceAll('?', '.')), ''];
// const loopAmount = updatedGroups.length;

// console.log('INPUT (groups, groupseparators, updatedGroupSeparators)', { updatedGroups, groupSeparators, updatedGroupSeparators });
// // console.log('updated spring row', this.generateSpringRow(groups, updatedGroupSeparators));

// const inputs = [ inputStringMatch ];
// console.log(' + NEW INPUT: ', inputs[0]);

// for (let index = 0; index < loopAmount; index++) {
//   const currentGroup = updatedGroups[index];
//   const currentGroupSeparator = updatedGroupSeparators[index];
//   console.log(`  [${index}]`, {currentGroup, currentGroupSeparator});

//   for (let currentCutOffGroupIndex = 0; currentCutOffGroupIndex < loopAmount - 1; currentCutOffGroupIndex++) { // -1
//     const currentCutOffGroup = updatedGroups[loopAmount - 1 - currentCutOffGroupIndex];
//     const currentCutOffGroupSeparator = updatedGroupSeparators[loopAmount - 1 - currentCutOffGroupIndex];
//     // console.log('currentCutOffGroupSeparator', currentCutOffGroupSeparator);

//     if(currentCutOffGroupSeparator !== undefined) {
//       console.log(`  [${index}][${currentCutOffGroupIndex}]`, {currentCutOffGroup, currentCutOffGroupSeparator});

//       for (let insideCutOffGroupSeparatorNegativeIndex = 0; insideCutOffGroupSeparatorNegativeIndex < currentCutOffGroupSeparator.length - 1; insideCutOffGroupSeparatorNegativeIndex++) {
//         const insideCutOffGroupSeparatorIndex = currentCutOffGroupSeparator.length - 1 - insideCutOffGroupSeparatorNegativeIndex;
//         console.log(`  [${index}][${currentCutOffGroupIndex}][${insideCutOffGroupSeparatorIndex}]`, {insideCutOffGroupSeparatorIndex});

//         let input1 = '';
//         // let input2 = '';
//         for (let inputBuilderIndex = 0; inputBuilderIndex < loopAmount; inputBuilderIndex++) {
//           console.log(`  [${index}][${currentCutOffGroupIndex}][${insideCutOffGroupSeparatorIndex}][${inputBuilderIndex}] inputBuilderIndex`, {inputBuilderIndex});

//           if (inputBuilderIndex === index && currentCutOffGroupIndex !== index) { // current
//             input1 += currentGroup;
//             input1 += currentGroupSeparator + currentCutOffGroupSeparator.substring(insideCutOffGroupSeparatorIndex);

//             // input2 += currentGroupSeparator + currentCutOffGroupSeparator.substring(insideCutOffGroupSeparatorIndex);
//             // input2 += currentGroup;
//           } else if (inputBuilderIndex === currentCutOffGroupIndex) {
//             input1 += currentCutOffGroup;
//             input1 += currentCutOffGroupSeparator.substring(0, insideCutOffGroupSeparatorIndex);

//             // input2 += currentCutOffGroupSeparator.substring(0, insideCutOffGroupSeparatorIndex);
//             // input2 += currentCutOffGroup;
//           } else { // other
//             input1 += updatedGroups[inputBuilderIndex];
//             input1 += updatedGroupSeparators[inputBuilderIndex];

//             // input2 += updatedGroupSeparators[inputBuilderIndex];
//             // input2 += updatedGroups[inputBuilderIndex];
//           }
//         }

//         // const filledInput1 = this.fillInput(input1, inputStringMatch.length);
//         console.log(' > NEW INPUT 1: ', input1);
//         // console.log(' > NEW INPUT 2: ', input2);
//         inputs.push(input1);
//         // inputs.push(input2);
//       }
//     }
//   }
// }

// console.log(' > inputs', inputs);
// const inputsWithoutDuplicates = [...new Set(inputs)];
// console.log(' > inputs without duplicates', inputsWithoutDuplicates);

// RESTANTEN

// const regexResult = springRegularExpression.exec(springRow.conditionsString);
// const inputStringMatch = regexResult ? regexResult[0] : '';

// // 1
// if (inputStringMatch.indexOf('?') === -1) {
//   rowIsFinished = true;
// }

// // 2
// const groupSeparators = regexResult?.slice(1).filter((_, index) => index % 2 === 1) ?? [];
// if (!rowIsFinished && groupSeparators.every((value) => value.length === 1)) {
//   rowIsFinished = true;
// }

// // 3
// if(!rowIsFinished && groupSeparators.every((value) => !!new RegExp('^[.]+$').exec(value))) {
//   rowIsFinished = true;
// }

// const matchesWithoutDuplicates = [...new Set(matches)];
// console.log('  > matches without duplicates', matchesWithoutDuplicates);

// generateSpringRow(groups: string[], groupSeparators: string[]): string {
//   let springRow = '';

//   for (let i = 0; i < groupSeparators.length; i++) {
//     springRow = springRow + groups[i] + groupSeparators[i];
//   }

//   return springRow;
// }

// updateGroupSeparators(groupSeparators: string[]): string[] {
//   if (groupSeparators.length < 2) {
//     return groupSeparators;
//   }

//   const lastGroupSeparator = groupSeparators[groupSeparators.length - 1];

//   if (lastGroupSeparator.length === 1) {
//     return groupSeparators;
//   }

//   let stringToBeMoved = lastGroupSeparator.substring(1);

//   if (groupSeparators.length === 2) {
//     return [
//       groupSeparators[0],
//       lastGroupSeparator.substring(0, 1),
//       stringToBeMoved
//     ]
//   }

//   return [
//     ...groupSeparators.slice(0, -1),
//     lastGroupSeparator.substring(0, 1),
//     stringToBeMoved
//   ];
// }
