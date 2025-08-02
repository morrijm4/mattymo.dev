export type Direction = 'up' | 'down' | 'left' | 'right';

export interface PointOptions {
    x: number;
    y: number;
}

export class Point {
    x: number;
    y: number;

    constructor({ x, y }: PointOptions) {
        this.x = x;
        this.y = y;
    }

    move(direction: Direction, scale: number = 1): Point {
        switch (direction) {
            case 'up':
                this.y += scale;
                break;
            case 'down':
                this.y -= scale;
                break;
            case 'left':
                this.x -= scale;
                break;
            case 'right':
                this.x += scale;
                break;
        }

        return this;
    }

    equals({ x, y }: Point): boolean {
        return x === this.x && y === this.y;
    }

    copy(): Point {
        return new Point(this);
    }
}
