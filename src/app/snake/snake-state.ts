import { Grid } from './grid';
import { Point, type Direction } from './point';

export interface SnakeOptions {
    grid?: Grid;
    food?: Point;
    snake?: Point[];
    score?: number;
    gameOver?: boolean;
    direction?: Direction;
    setHighScore?: (score: number) => void;
};

export class SnakeState {
    INITIAL_SPEED = 300;

    grid: Grid;
    food: Point | undefined;
    snake: Point[];
    score: number;
    gameOver: boolean;
    direction: Direction | undefined;

    setHighScore?: (score: number) => void;

    constructor({
        grid = new Grid(),
        food,
        snake = [],
        score = 0,
        gameOver = false,
        direction,
        setHighScore,
    }: SnakeOptions = {}) {
        this.grid = grid;
        this.food = food;
        this.snake = snake;
        this.score = score;
        this.gameOver = gameOver;
        this.direction = direction;
        this.setHighScore = setHighScore;
    }

    init(): SnakeState {
        const head = new Point({
            x: this.#half(this.grid.rows) - 2,
            y: this.#half(this.grid.cols),
        });

        this.snake.push(
            head,
            head.copy().move('left'),
            head.copy().move('left', 2),
        );

        for (const point of this.snake) {
            this.grid.update(point, { status: 'snake' });
        }

        this.food = new Point({
            x: this.#half(this.grid.rows) + 2,
            y: this.#half(this.grid.rows),
        });
        this.grid.update(this.food, { status: 'food' });

        return this;
    }

    move(direction: Direction): SnakeState {
        if (this.gameOver) {
            throw new Error('Should not move when game is over');
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
            this.setHighScore?.(this.score);
            return this;
        }

        this.snake.unshift(next);
        this.grid.update(next, { status: 'snake' });

        if (this.food == null) {
            throw new Error('Food should be defined');
        }

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
        if (this.direction == null) {
            return direction === 'left';
        }

        return (
            (this.direction === 'up' && direction === 'down') ||
            (this.direction === 'down' && direction === 'up') ||
            (this.direction === 'left' && direction === 'right') ||
            (this.direction === 'right' && direction === 'left')
        );
    }

    isPlaying(): boolean {
        return this.direction != null && !this.gameOver;
    }

    isInitialized(): boolean {
        return this.snake.length !== 0;
    }

    canMove(direction: Direction): boolean {
        return (
            this.isInitialized() &&
            !this.isBackwards(direction) &&
            !this.gameOver
        );
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
