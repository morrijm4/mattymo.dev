import type { ActionDispatch } from 'react';
import type { Direction } from '../point';
import type { SnakeEvent } from '../page';
import {
    ArrowUp,
    ArrowDown,
    ArrowRight,
    ArrowLeft,
} from '../icons/arrows';
import type { SnakeState } from '../snake-state';

export interface ArrowProps {
    direction: Direction;
    dispatch: ActionDispatch<[event: SnakeEvent]>
    ss: SnakeState;
};

const className = 'dark:fill-white border rounded-4xl lg:invisible';
const size = 48;

export function Arrow({ direction, ss, dispatch }: ArrowProps) {
    const onClick = () => {
        if (ss.canMove(direction)) {
            dispatch({ type: 'move', direction });
        }
    };

    switch (direction) {
        case 'up':
            return <ArrowUp
                className={className}
                width={size}
                height={size}
                onClick={onClick}
            />
        case 'down':
            return <ArrowDown
                className={className}
                width={size}
                height={size}
                onClick={onClick}
            />
        case 'right':
            return <ArrowRight
                className={className}
                width={size}
                height={size}
                onClick={onClick}
            />
        case 'left':
            return <ArrowLeft
                className={className}
                width={size}
                height={size}
                onClick={onClick}
            />
    };
}
