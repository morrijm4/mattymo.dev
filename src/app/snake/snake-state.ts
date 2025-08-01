import { Grid } from './grid';
import { Point } from './point';
import { Box } from './box';

export interface SnakeOptions {
    grid?: Grid
    head?: Point;
    tail?: Point;
    food?: Point;
}

export class SnakeState {
    grid: Grid;

    head: Point | undefined;
    tail: Point | undefined;
    food: Point | undefined;

    constructor({
        grid = new Grid({ rows: 11, cols: 11 }),
        head,
        tail,
        food,
    }: SnakeOptions = {}) {
        this.grid = grid;
        this.head = head;
        this.tail = tail;
        this.food = food;
    }

    init(): SnakeState {
        this.head = new Point(
            this.#half(this.grid.rows),
            this.#half(this.grid.cols),
        );

        this.tail = this.head;
        this.grid.setBox(this.head, new Box({ status: 'snake' }));

        this.food = this.createFoodPoint();
        this.grid.setBox(this.food, new Box({ status: 'food' }));

        return this;
    }

    createFoodPoint(): Point {
        const point = new Point(
            this.#randNum(this.grid.rows),
            this.#randNum(this.grid.cols),
        );

        if (this.grid.getBox(point).status !== 'empty') {
            return this.createFoodPoint();
        }

        return point;
    }

    copy(): SnakeState {
        return new SnakeState(this);
    }

    #randNum(num: number): number {
        return Math.floor(Math.random() * num);
    }

    #half(num: number): number {
        return Math.floor(num / 2);
    }
}
