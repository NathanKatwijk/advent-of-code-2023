import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayComponent } from '../day/day.component';

type ScratchCard = {
  index: number;
  amountOfMatchingCards: number;
}

type ScratchCardScore = {
  scratchCardIndex: number;
  calculatedScore: number;
}

@Component({
  selector: 'app-day-4-2',
  templateUrl: './day-4-2.component.html',
  styleUrls: ['./day-4-2.component.css']
})
export class Day42Component extends DayComponent implements OnInit {
  scratchCards: ScratchCard[] = [];

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-4/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    const scratchCardStrings = data.split('\n').slice(0, 205); // the actual assignment input
    // const scratchCardStrings = data.split('\n').slice(0, 6); // for the example input
    // console.log('splittedStringList', scratchCardStrings);

    // console.log('');
    this.scratchCards = this.retrieveScratchCards(scratchCardStrings);
    // console.log('scratchCards', this.scratchCards);

    this.result = NaN; // this.calculateResult();
    // console.log('=====');
    // console.log(`Day 4.2 result: ${this.result}`);
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

      const amountOfMatchingCards = winningNumbers.filter(
        (winningNumber: number) => normalNumbers.includes(winningNumber)
      ).length;

      return {
        index,
        amountOfMatchingCards
      };
    });

    return scratchCards;
  }


  private calculateResult(): number {
    const scratchCardScoresResult = this.scratchCards
      .map((scratchCard: ScratchCard, index: number) => {
        // console.log('');
        // console.log(`[${index}] recursive calculation START`);

        let partialResult: ScratchCardScore[] = [];
        for (let forLoopIndex = 0; forLoopIndex <= scratchCard.amountOfMatchingCards; forLoopIndex++) {
          // console.log('  partial sub result (recursive) START', { index, forLoopIndex }, { amountOfMatchingCards: scratchCard.amountOfMatchingCards });
          const partialSubResult = this.calculateScratchCardCopiesScore({
            scratchCardIndex: index + forLoopIndex,
            calculatedScore: 0
          });
          partialResult.push(partialSubResult);
          // console.log('  partial sub result (recursive) END', { index, forLoopIndex, partialSubResult });
        }
        // const partialResult: ScratchCardScore = this.calculateScratchCardCopiesScore({
        //   scratchCardIndex: index,
        //   calculatedScore: 0
        // });

        // console.log(`[${index}] recursive calculation END`, partialResult);
        return partialResult;
    });

    // console.log('');
    // console.log('calculated score object', scratchCardScoresResult);

    const scratchCardScoresAmount = scratchCardScoresResult.flat().reduce((acc: number, { calculatedScore }: { calculatedScore: number }) =>
      acc === 0 ? calculatedScore : acc + calculatedScore
    , 0);
    // console.log('calculated score amount', scratchCardScoresAmount);
    return scratchCardScoresAmount;
  }

  private calculateScratchCardCopiesScore(score: ScratchCardScore): ScratchCardScore {
    const currentScratchCard = this.scratchCards[score.scratchCardIndex];
    const amountOfMatchingNumbers = currentScratchCard.amountOfMatchingCards;
    // console.log('   inside recursive calculation START', { amountOfMatchingNumbers, score, currentScratchCard });

    if (amountOfMatchingNumbers === 0) {
      // console.log('   inside recursive calculation END', { scratchCardIndex: score.scratchCardIndex, calculatedScore: score.calculatedScore + 1 });
      return {
        scratchCardIndex: score.scratchCardIndex,
        calculatedScore: score.calculatedScore + 1,
      };
    }

    const scratchCardIndex = score.scratchCardIndex + 1;
    const calculatedScore = score.calculatedScore + 1 + currentScratchCard.amountOfMatchingCards;

    const result = {
      scratchCardIndex,
      calculatedScore,
    };

    // console.log('   inside recursive calculation END', { scratchCardIndex: score.scratchCardIndex, calculatedScore });
    return this.calculateScratchCardCopiesScore(result);
  }
}
