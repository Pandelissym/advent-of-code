const fs = require("fs");

/**
 * Class representing a bingo card
 * Keeps track of the number matrix using a 2D array
 * Also keeps track of how many numbers have been marked in each row and each column
 * using the *columnMarks* and *rowMarks* arrays.
 * *completed* keeps track of wether the card is completed or not (ie if a whole row or
 *  whole column has been marked off)
 */
class BingoCard {
  numbers: number[][];
  marked: boolean[][];
  rowMarks: number[];
  columnMarks: number[];
  completed: boolean;

  constructor(numbers: number[][]) {
    this.numbers = numbers;
    this.marked = [];
    for (let i = 0; i < 5; i++) {
      this.marked.push([false, false, false, false, false]);
    }
    this.rowMarks = [0, 0, 0, 0, 0];
    this.columnMarks = [0, 0, 0, 0, 0];
    this.completed = false;
  }

  /**
   * Adds a new row to the card.
   * @param row Row of numbers to be added to the card
   */
  addRow(row: number[]): void {
    this.numbers.push(row);
  }

  /**
   * Calculates the score of the card given the last number that was shown
   * by adding all the numbers on the card that have not been marked
   * and multiplying that by the last number.
   * @param lastNumber The last number that has been shown in the game.
   * @returns
   */
  getScore(lastNumber: number): number {
    let sum = 0;

    for (let i = 0; i < this.numbers.length; i++) {
      for (let j = 0; j < this.numbers[0].length; j++) {
        if (this.marked[i][j] == false) sum += this.numbers[i][j];
      }
    }
    return sum * lastNumber;
  }

  /**
   * Marks a given number on the card.
   * Checks if number exists on the card. If it has not been marked off already
   * it is marked, the numbers column and row mark counters are incremented by one.
   * Then if the row/column marks have reached 5 it means the row/column has been
   * completed and returns a boolean representing if the card was completed or not.
   * @param number Number to be marked
   * @returns Whether marking this number completed the card or not
   */
  addNumber(number: number): boolean {
    for (let i = 0; i < this.numbers.length; i++) {
      for (let j = 0; j < this.numbers[0].length; j++) {
        // Find the number on the card
        if (this.numbers[i][j] === number) {
          // If it has not been marked, mark it and increment row/column counters
          // Check if card was completed by marking this number
          if (this.marked[i][j] === false) {
            this.marked[i][j] = true;
            this.rowMarks[i]++;
            this.columnMarks[j]++;
            if (this.rowMarks[i] === 5) {
              this.completed = true;
            }
            if (this.columnMarks[j] === 5) {
              this.completed = true;
              return true;
            }
          }
        }
      }
    }
    return this.completed;
  }
}

/**
 * Function that takes raw input and parses it into
 * bingo card objects.
 * @param input raw input
 * @returns a list of BingoCard objects.]
 */
function parseBingoCards(input: string[]): BingoCard[] {
  let index = 0;
  let bingoGame: BingoCard[] = [];

  while (index < input.length) {
    let card: BingoCard = new BingoCard([]);

    for (let i = 0; i < 5; i++) {
      let row = input[index]
        .slice(0, 14)
        .split(" ")
        .filter((x) => x != "")
        .map((x) => Number(x));
      card.addRow(row);
      index++;
    }
    bingoGame.push(card);
    index++;
  }
  return bingoGame;
}

const data: string[] = fs
  .readFileSync("./day4input.txt", {
    encoding: "utf8",
  })
  .split("\n");

// parse the list of numbers appearing in the game
let numberList: number[] = data[0].split(",").map((x) => Number(x));
//parse the bingo cards
let bingoGame: BingoCard[] = parseBingoCards(data.slice(2));

// For each appearing number go through all bingo cards and mark that number if it exists.
// Keep track of the amount of cards that have been completed. Once the last game is completed
// return the result and end the game.
let winners = 0;
for (let i = 0; i < numberList.length; i++) {
  for (let j = 0; j < bingoGame.length; j++) {
    if (
      bingoGame[j].completed === false &&
      bingoGame[j].addNumber(numberList[i]) === true
    ) {
      winners++;
      if (winners === 1) console.log(bingoGame[j].getScore(numberList[i]));
      if (winners === bingoGame.length) {
        console.log(bingoGame[j].getScore(numberList[i]));
        i = numberList.length + 1;
      }
    }
  }
}
