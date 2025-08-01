import { Box } from './box';
import { Point } from "./point";

export interface GridOptions {
    rows: number;
    cols: number;
};

export class Grid {
    boxes: Box[][];

    rows: number;
    cols: number;

    constructor({ rows, cols }: GridOptions) {
        this.rows = rows;
        this.cols = cols;

        this.boxes = Array.from({ length: rows }, () => {
            return Array.from({ length: cols }, () => new Box({
                status: 'empty',
            }));
        })
    }

    getBox(point: Point): Box {
        return this.boxes[point.y][point.x];
    }

    setBox(point: Point, box: Box): void {
        this.boxes[point.y][point.x] = box;
    }
};
