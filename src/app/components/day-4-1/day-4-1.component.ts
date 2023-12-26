import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayComponent } from '../day/day.component';

type ScratchCard = {
  index: number;
  winningNumbers: number[];
  normalNumbers: number[];
}

type ScratchCardPoint = {
  amountOfMatchingCards: number;
  calculatedPoints: number;
}

@Component({
  selector: 'app-day-4-1',
  templateUrl: './day-4-1.component.html',
  styleUrls: ['./day-4-1.component.css']
})
export class Day41Component extends DayComponent implements OnInit {
  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-4/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    const scratchCardStrings = data.split('\n').slice(0, 205);
    // const scratchCardStrings = data.split('\n').slice(0, 6); // for the example input
    // console.log('splittedStringList', scratchCardStrings);

    const scratchCards = this.retrieveScratchCards(scratchCardStrings);
    // console.log('scratchCards', scratchCards);

    this.result = this.calculateResult(scratchCards);
    // console.log('=====');
    // console.log(`Day 4.1 result: ${this.result}`);
  }

  private retrieveScratchCards(scratchCardStrings: string[]): ScratchCard[] {
    const scratchCards = scratchCardStrings.map((scratchCardString: string, index: number) => {
      const winningNumbers = scratchCardString
        .substring(scratchCardString.indexOf(':')+1, scratchCardString.indexOf('|')-1)
        .trim()
        .split(/\s+/)
        .map((numberString: string) => parseInt(numberString.trim(), 10));

      const normalNumbers = scratchCardString
        .substring(scratchCardString.indexOf('|')+1)
        .trim()
        .split(/\s+/)
        .map((numberString: string) => parseInt(numberString.trim(), 10));

      return {
        index,
        winningNumbers,
        normalNumbers
      };
    });

    return scratchCards;
  }

  private calculateResult(scratchCards: ScratchCard[]): number {
    return scratchCards.reduce((acc: number, scratchCard: ScratchCard) => {
      const amountOfMatchingCards = scratchCard.winningNumbers.filter(
        (winningNumber: number) => scratchCard.normalNumbers.includes(winningNumber)
      ).length;
      // console.log('amountOfMatchingCards', amountOfMatchingCards);

      const cardResult = this.doublePointAmount({
        calculatedPoints: 0,
        amountOfMatchingCards,
      });
      // console.log(cardResult);

      return acc + cardResult.calculatedPoints;
    }, 0);
  }

  private doublePointAmount(point: ScratchCardPoint): ScratchCardPoint {
    if (point.amountOfMatchingCards === 0) {
      return point;
    }

    return this.doublePointAmount({
      calculatedPoints: point.calculatedPoints === 0 ? 1 : (point.calculatedPoints + point.calculatedPoints),
      amountOfMatchingCards: point.amountOfMatchingCards - 1,
    });
  }
}
