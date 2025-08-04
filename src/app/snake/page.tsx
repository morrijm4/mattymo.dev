'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { SnakeState } from "./snake-state";
import { useKeyDown } from './hooks/use-key-down';
import type { Direction } from './point';
import { useLatest } from './hooks/use-latest';
import { useHighScore } from './hooks/use-high-score';
import { Arrow } from './ui/arrow';

export type SnakeEvent = {
    type: 'play';
} | {
    type: 'move';
    direction: Direction;
};

function reducer(ss: SnakeState, event: SnakeEvent): SnakeState {
    switch (event.type) {
        case 'play':
            return new SnakeState({ setHighScore: ss.setHighScore })
                .init();
        case 'move':
            return ss.copy().move(event.direction);
    }
}

const upKeys = ['ArrowUp', 'w', 'k'];
const downKeys = ['ArrowDown', 's', 'j'];
const leftKeys = ['ArrowLeft', 'a', 'h'];
const rightKeys = ['ArrowRight', 'd', 'l'];

const keyMap = new Map<Direction, string[]>([
    ['up', upKeys],
    ['down', downKeys],
    ['left', leftKeys],
    ['right', rightKeys],
]);

export default function Page() {
    const [highScore, setHighScore] = useHighScore();
    const [ss, dispatch] = useReducer(reducer, new SnakeState({
        setHighScore
    }));
    const ssRef = useLatest(ss);

    useKeyDown(useCallback((event) => {
        for (const [direction, keys] of keyMap) {
            if (
                !keys.includes(event.key) ||
                !ssRef.current.canMove(direction)
            ) {
                continue;
            }

            dispatch({ type: 'move', direction });
        }
    }, [ssRef]));

    useEffect(() => {
        if (!ss.isPlaying()) {
            return;
        }

        const timeout = setTimeout(() => {
            if (ssRef.current.direction == null) {
                throw new Error('Direction should be defined');
            }

            dispatch({ type: 'move', direction: ssRef.current.direction });
        }, ss.getSnakeSpeed())

        return () => clearTimeout(timeout);
    }, [ss, ssRef]);

    return (
        <div>
            <h1>Snake</h1>
            <div className="flex justify-between h-6">
                <p className={`m-0 ${ss.isPlaying() ? 'invisible' : ''}`}>
                    {!ss.isInitialized() || ss.gameOver ? (
                        <button
                            className="border rounded-2xl px-2 py-1"
                            onClick={() => dispatch({ type: 'play' })}
                        >
                            Play
                        </button>
                    ) : (
                        'Press any arrow key to start.'
                    )}
                </p>
                {ss.gameOver && <p className="m-0">Game over!</p>}
            </div>
            <p className='mb-0'>Score: {ss.score}</p>
            <p className='mt-0'>High score: {highScore}</p>

            <div className="flex flex-col items-center gap-4">

                <div className="flex flex-col-reverse">
                    {ss.grid.boxes.map((row, i) => {
                        return <div key={`row-${i}`} className="flex">
                            {row.map((box, j) => {
                                const classes: string[] = [
                                    'border',
                                    'size-5'
                                ];
                                switch (box.status) {
                                    case 'food':
                                        classes.push('bg-red-500');
                                        break;
                                    case 'snake':
                                        classes.push('bg-yellow-500');
                                        break;
                                }
                                return <div
                                    key={`${box.status}-${i + j}`}
                                    className={classes.join(' ')}
                                />;
                            })}
                        </div>
                    })}
                </div>

                <Arrow dispatch={dispatch} ss={ss} direction='up' />
                <div className='flex gap-12'>
                    <Arrow dispatch={dispatch} ss={ss} direction='left' />
                    <Arrow dispatch={dispatch} ss={ss} direction='right' />
                </div>
                <Arrow dispatch={dispatch} ss={ss} direction='down' />


            </div>
        </div >
    );
}
