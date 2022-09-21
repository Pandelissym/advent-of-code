const fs = require("fs");

/**
 * Class representing a point containing x and y coordinates
 * and static function to parse a point from a string.
 */
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static parsePoint(point: string): Point {
    let coords: string[] = point.split(",");

    let x: number = Number(coords[0]);
    let y: number = Number(coords[1]);
    return new Point(x, y);
  }
}

/**
 * Class representing a line. Contains 2 points defining its
 * starting position and ending position as well as
 * a property defining the lines direction (vertical, horizontal or diagonal)
 */
class Line {
  start: Point;
  end: Point;
  direction: "horizontal" | "vertical" | "diagonal";

  constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
    if (start.x === end.x) this.direction = "vertical";
    else if (start.y === end.y) this.direction = "horizontal";
    else this.direction = "diagonal";
  }

  // Method to parse a line from a raw input string
  static parseLine(line: string): Line {
    // First split on the arrow then parse the two points
    let points: string[] = line.split(" -> ");
    let start = Point.parsePoint(points[0]);
    let end = Point.parsePoint(points[1]);

    // Restructure the line in standard format so the starting point is always
    // on the left or the top if vertical to allow quicker computation down the line.
    if (start.x === end.x) {
      if (end.y < start.y) {
        let temp = start;
        start = end;
        end = temp;
      }
    } else if (end.x < start.x) {
      let temp = start;
      start = end;
      end = temp;
    }

    return new Line(start, end);
  }
}

/**
 * Function that counts the amount of intersecting lines (>=2) by
 * keeping a map of all the points and how many times that point has been
 * covered by a line
 * @param lines A list of lines to use
 * @returns the amount of points at which 2 or more lines intersect
 */

function countIntersections(lines: Line[]): number {
  let map = new Map();

  for (let i = 0; i < lines.length; i++) {
    // compute all the points the line covers and store them in the points array
    let points: string[] = [lines[i].start.x + "," + lines[i].start.y];
    let x1: number = lines[i].start.x;
    let x2: number = lines[i].end.x;
    let y1: number = lines[i].start.y;
    let y2: number = lines[i].end.y;

    // Based on the lines direction loop over all points the line covers
    // and add them to the points array
    if (lines[i].direction === "horizontal") {
      while (x1 < x2) {
        x1++;
        points.push(x1 + "," + y1);
      }
    } else if (lines[i].direction === "vertical") {
      while (y1 < y2) {
        y1++;
        points.push(x1 + "," + y1);
      }
    } else if (lines[i].direction === "diagonal") {
      if (y2 < y1) {
        while (x1 < x2 && y1 > y2) {
          x1++;
          y1--;
          points.push(x1 + "," + y1);
        }
      } else {
        while (x1 < x2 && y1 < y2) {
          x1++;
          y1++;
          points.push(x1 + "," + y1);
        }
      }
    }

    // Loop over all the points the line covers and update
    // its value in the map initializing it to 1 if it's a new point
    // or incrementing its value by 1 if it has been encountered before.
    for (let j = 0; j < points.length; j++) {
      let value: number = map.get(points[j]) || 0;
      map.set(points[j], value + 1);
    }
  }

  // Count all the points that have been covered more than 2 times
  let count: number = 0;
  for (let value of map.values()) if (value >= 2) count++;
  return count;
}

const data: string[] = fs
  .readFileSync("C:/Users/Pandelis/Documents/advent of code/day5input.txt", {
    encoding: "utf8",
  })
  .split("\n");

// parse raw input into Line objects
let lines = data.map((x: string) => Line.parseLine(x));
// filter out diagonal lines
let filteredLines = lines.filter((x: Line) => x.direction != "diagonal");

// Part 1
console.log(countIntersections(filteredLines));

// Part 2
console.log(countIntersections(lines));
