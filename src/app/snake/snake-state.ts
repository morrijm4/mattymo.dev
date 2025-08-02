import { Grid } from './grid';
import { Point, type Direction } from './point';

export interface SnakeOptions {
    grid?: Grid;
    food?: Point;
    snake?: Point[];
    score?: number;
    gameOver?: boolean;
    direction?: Direction;
};

export class SnakeState {
    INITIAL_SPEED = 300;

    grid: Grid;
    food: Point | undefined;
    snake: Point[];
    score: number;
    gameOver: boolean;
    direction: Direction | undefined;

    constructor({
        grid = new Grid(),
        food,
        snake = [],
        score = 0,
        gameOver = false,
        direction,
    }: SnakeOptions = {}) {
        this.grid = grid;
        this.food = food;
        this.snake = snake;
        this.score = score;
        this.gameOver = gameOver;
        this.direction = direction
    }

    init(): SnakeState {
        const head = new Point({
            x: this.#half(this.grid.rows),
            y: this.#half(this.grid.cols),
        });

        this.snake.push(
            head,
            head.copy().move('down'),
            head.copy().move('down', 2),
        );

        for (const point of this.snake) {
            this.grid.update(point, { status: 'snake' });
        }

        this.food = this.createFoodPoint();
        this.grid.update(this.food, { status: 'food' });

        this.direction = 'up';

        return this;
    }

    move(direction: Direction): SnakeState {
        if (this.gameOver) {
            return this;
        }

        if (this.isBackwards(direction)) {
            throw new Error('Cannot move backwords');
        }

        this.direction = direction;

        const head = this.snake.at(0);

        if (head == null) {
            throw new Error('Snake does not have a head');
        }

        const next = head.copy().move(direction);

        if (!this.grid.includes(next) || this.snake.some((point) => point.equals(next))) {
            this.gameOver = true;
            return this;
        }

        if (this.food == null) {
            throw new Error('Food should be defined');
        }

        this.snake.unshift(next);
        this.grid.update(next, { status: 'snake' });

        if (this.food.equals(next)) {
            this.score += 1;
            this.food = this.createFoodPoint();
            this.grid.update(this.food, { status: 'food' });
            return this;
        }

        const tail = this.snake.pop();

        if (tail == null) {
            throw new Error('Snake does not have a tail');
        }

        this.grid.update(tail, { status: 'empty' });

        return this;
    }

    createFoodPoint(): Point {
        const point = new Point({
            x: this.#randNum(this.grid.rows),
            y: this.#randNum(this.grid.cols),
        });

        if (this.grid.getBox(point).status !== 'empty') {
            return this.createFoodPoint();
        }

        return point;
    }

    getSnakeSpeed() {
        return Math.max(this.INITIAL_SPEED - Math.log(this.score + 1) * 60, 100);
    }

    isBackwards(direction: Direction): boolean {
        return (
            (this.direction === 'up' && direction === 'down') ||
            (this.direction === 'down' && direction === 'up') ||
            (this.direction === 'left' && direction === 'right') ||
            (this.direction === 'right' && direction === 'left')
        );
    }

    isPlaying(): boolean {
        return this.snake.length !== 0 && !this.gameOver;
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
};
