import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DayComponent } from '../day/day.component';

enum HandType {
  FIVE_OF_A_KIND = 'FIVE_OF_A_KIND',
  FOUR_OF_A_KIND = 'FOUR_OF_A_KIND',
  FULL_HOUSE = 'FULL_HOUSE',
  THREE_OF_A_KIND = 'THREE_OF_A_KIND',
  TWO_PAIR = 'TWO_PAIR',
  ONE_PAIR = 'ONE_PAIR',
  HIGH_CARD = 'HIGH_CARD'
};

type Hand = {
  handString: string;
  cards: string[];
  bid: number;
  handType: HandType;
}

@Component({
  selector: 'app-day-7-1',
  templateUrl: './day-7-1.component.html',
  styleUrls: ['./day-7-1.component.css']
})
export class Day71Component extends DayComponent implements OnInit {
  // Highest first, lowest last
  readonly CARD_LABELS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    this.httpClient.get('assets/day-7/input.txt', { responseType: 'text' }).subscribe((data: any) => {
      this.process(data);
    });
  }

  override process(data: string): void {
    const splittedStringList = data.split('\n').slice(0, data.split('\n').length - 1);
    // console.log('splittedStringList', splittedStringList);

    const hands = this.retrieveHands(splittedStringList);
    // console.log('hands', hands);

    const handsOrderedByType = this.orderHandsByType(hands);
    // console.log('handsOrderedByType', handsOrderedByType);

    const handsOrderedByRank = this.orderHandsByRank(handsOrderedByType);
    // console.log('handsOrderedByRank', handsOrderedByRank);

    this.result = this.calculateResult(handsOrderedByRank);

    // console.log('=====');
    // console.log(`Day 7.1 result: ${this.result}`);
  }

  retrieveHands(handsString: string[]): Hand[] {
    const hands: Hand[] = [];

    handsString.forEach((handString: string) => {
      const cards = handString.substring(0, handString.indexOf(' ')).split('');
      const bid = parseInt(handString.substring(handString.indexOf(' ')+1), 10);
      // @ts-ignore
      let handType: HandType = undefined;

      const lettersAndAmountsOfHand = this.retrieveLettersAndAmountsOfHand(cards);
      // console.log('lettersAndAmountsOfHand', lettersAndAmountsOfHand);

      if(this.retrieveMapItemsWithAmount(lettersAndAmountsOfHand, 5).size === 1) {
        handType = HandType.FIVE_OF_A_KIND;
      }

      if (handType === undefined && this.retrieveMapItemsWithAmount(lettersAndAmountsOfHand, 4).size === 1) {
        handType = HandType.FOUR_OF_A_KIND;
      }

      if(handType === undefined &&
        this.retrieveMapItemsWithAmount(lettersAndAmountsOfHand, 3).size === 1 &&
        this.retrieveMapItemsWithAmount(lettersAndAmountsOfHand, 2).size === 1
      ) {
        handType = HandType.FULL_HOUSE;
      }

      if(handType === undefined &&
        this.retrieveMapItemsWithAmount(lettersAndAmountsOfHand, 3).size === 1 &&
        this.retrieveMapItemsWithAmount(lettersAndAmountsOfHand, 2).size === 0
      ) {
        handType = HandType.THREE_OF_A_KIND;
      }

      if(handType === undefined && this.retrieveMapItemsWithAmount(lettersAndAmountsOfHand, 2).size === 2) {
        handType = HandType.TWO_PAIR;
      }

      if(handType === undefined &&
        this.retrieveMapItemsWithAmount(lettersAndAmountsOfHand, 3).size === 0 &&
        this.retrieveMapItemsWithAmount(lettersAndAmountsOfHand, 2).size === 1
      ) {
        handType = HandType.ONE_PAIR;
      }

      if(handType === undefined && this.retrieveMapItemsWithAmount(lettersAndAmountsOfHand, 1).size === 5) {
        handType = HandType.HIGH_CARD;
      }

      if (handType?.length > 0) {
        hands.push({
          handString: handString.substring(0, handString.indexOf(' ')),
          cards,
          bid,
          handType
        })
      }
    });

    return hands;
  }

  retrieveLettersAndAmountsOfHand(cards: string[]): Map<string, number> {
    const lettersAndAmountsOfHand = new Map<string, number>();

    this.CARD_LABELS.forEach((cardLabel) => {
      const amount = cards.filter((card) => card === cardLabel)?.length || 0;

      if (amount > 0) {
        lettersAndAmountsOfHand.set(cardLabel, amount);
      }
    });

    return lettersAndAmountsOfHand;
  }

  retrieveMapItemsWithAmount(lettersAndAmountsOfHand: Map<string, number>, amount: number): Map<string, number> {
    const subMap = new Map<string, number>();

    lettersAndAmountsOfHand.forEach((value: number, key: string) => {
      if (value === amount) {
        subMap.set(key, value);
      }
    });

    return subMap;
  }

  orderHandsByType(hands: Hand[]): Hand[][] {
    return [
      hands.filter((hand) => hand.handType === HandType.FIVE_OF_A_KIND),
      hands.filter((hand) => hand.handType === HandType.FOUR_OF_A_KIND),
      hands.filter((hand) => hand.handType === HandType.FULL_HOUSE),
      hands.filter((hand) => hand.handType === HandType.THREE_OF_A_KIND),
      hands.filter((hand) => hand.handType === HandType.TWO_PAIR),
      hands.filter((hand) => hand.handType === HandType.ONE_PAIR),
      hands.filter((hand) => hand.handType === HandType.HIGH_CARD),
    ].filter((hands: Hand[]) => hands.length > 0);
  }

  orderHandsByRank(handsOrderedByType: Hand[][]): Hand[] {
    const handsOrderedByRank = handsOrderedByType
      .filter((handsOfType: Hand[]) => handsOfType?.length > 0)
      .map((handsOfType: Hand[]) =>
        handsOfType.sort((handA: Hand, handB: Hand) => {
          let result = 0;

          handA.cards.forEach((handACard: string, cardIndex: number) => {
            const handACardIndex = this.CARD_LABELS.indexOf(handACard);
            const handBCardIndex = this.CARD_LABELS.indexOf(handB.cards[cardIndex]);

            if (handACardIndex < handBCardIndex && result === 0) {
              result = -1;
            }
            if (handACardIndex > handBCardIndex && result === 0) {
              result = 1;
            }
          });

          return result;
        })
      );

    return handsOrderedByRank.flat();
  }

  calculateResult(handsOrderedByRank: Hand[]): number {
    const amountOfHands = handsOrderedByRank.length;

    return handsOrderedByRank.reduce((acc: number, hand: Hand, index: number) => {
      if (acc === 0) {
        return hand.bid * (amountOfHands - index);
      } else {
        return acc + (hand.bid * (amountOfHands - index));
      }
    }, 0)
  }
}

// if (cards.every((card: string) => card === handString[0])) {
//   handType = HandType.FIVE_OF_A_KIND;
// }
