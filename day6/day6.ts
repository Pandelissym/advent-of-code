const fs = require("fs");

/**
 * Function that calculates the total amount of lanternfish by the end of *days* days using
 * the following algorithm:
 * The possible internal timers are 0-8
 * Keep an array of length 8 that keeps track of the amount of fish at each internal timing.
 * Each day the timers drop by 1 which is done by shifting the array one time to the left.
 * The amount of fish that have internal timing of 0 create a new one hence that amount of fish
 * is added to position 8 and also those fish are reset to a timing of 6 by adding that amount to
 * position 6 of the array.
 * By the end the sum of the values in the array represents the total amount of fish.
 * @param numbers Input array of initial internal timers
 * @param days The number of days for which to run the simulation
 * @returns The total amount of lanternfish by the end of the amount of days
 */
function solve(numbers: number[], days: number): number {
  // initialize internal timings array
  let values = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Loop over input timings and count the amount of fish at each timing
  for (let x of numbers) {
    values[x]++;
  }

  // Each day shift the array to the left
  // Add the amount of fish at 0 to 8 representing the new lanternfish
  // Add the amount of fish to 6 representing them resetting their timing.
  for (let i = 0; i < days; i++) {
    let first: number = values.shift()!;
    values.push(first);
    values[6] += first;
  }

  // Calculate the sum of the values
  return values.reduce((prev: number, cur: number) => prev + cur, 0);
}

const data: string = fs.readFileSync("./day6input.txt", {
  encoding: "utf8",
});

// parse raw input into an array of numbers
let numbers: number[] = data.split(",").map(Number);

// Part 1
console.log(solve(numbers, 80));

// Part 2
console.log(solve(numbers, 256));
