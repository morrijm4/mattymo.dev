import { Box, type BoxOptions } from './box';
import { Point } from "./point";

export interface GridOptions {
    rows?: number;
    cols?: number;
};

export class Grid {
    boxes: Box[][];

    rows: number;
    cols: number;

    constructor({ rows = 11, cols = 11 }: GridOptions = {}) {
        this.rows = rows;
        this.cols = cols;

        this.boxes = Array.from({ length: rows }, () => {
            return Array.from({ length: cols }, () => new Box({
                status: 'empty',
            }));
        })
    }

    includes({ x, y }: Point): boolean {
        return x >= 0 && x < this.rows && y >= 0 && y < this.cols;
    }

    update(point: Point, opts: BoxOptions): Grid {
        const box = this.getBox(point);

        this.setBox(point, {
            ...box,
            ...opts,
        });

        return this;
    }

    getBox(point: Point): Box {
        return this.boxes[point.y][point.x];
    }

    setBox(point: Point, box: Box): void {
        this.boxes[point.y][point.x] = box;
    }
};
