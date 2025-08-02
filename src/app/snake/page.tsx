'use client';

import { useCallback, useEffect, useReducer } from 'react';
import { SnakeState } from "./snake-state";
import { useKeyDown } from './hooks/use-key-down';
import type { Direction } from './point';
import { useLatest } from './hooks/use-latest';

type SnakeEvent = {
    type: 'play';
} | {
    type: 'move';
    direction: Direction
};

function reducer(ss: SnakeState, event: SnakeEvent): SnakeState {
    switch (event.type) {
        case 'play':
            return new SnakeState().init();
        case 'move':
            return ss.copy().move(event.direction);
    }
}

const upKeys = ['ArrowUp', 'w', 'k'];
const downKeys = ['ArrowDown', 's', 'j'];
const leftKeys = ['ArrowLeft', 'a', 'h'];
const rightKeys = ['ArrowRight', 'd', 'l'];

export default function Page() {
    const [ss, dispatch] = useReducer(reducer, new SnakeState());
    const ssRef = useLatest(ss);

    const up = useCallback(() => {
        if (ssRef.current.isBackwards('up')) return;
        dispatch({ type: 'move', direction: 'up' })
    }, [ssRef]);

    const down = useCallback(() => {
        if (ssRef.current.isBackwards('down')) return;
        dispatch({ type: 'move', direction: 'down' })
    }, [ssRef]);

    const left = useCallback(() => {
        if (ssRef.current.isBackwards('left')) return;
        dispatch({ type: 'move', direction: 'left' })
    }, [ssRef]);

    const right = useCallback(() => {
        if (ssRef.current.isBackwards('right')) return;
        dispatch({ type: 'move', direction: 'right' })
    }, [ssRef]);

    useKeyDown(upKeys, up);
    useKeyDown(downKeys, down);
    useKeyDown(leftKeys, left);
    useKeyDown(rightKeys, right);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (ss.isPlaying()) {
            timeout = setTimeout(() => {
                if (ss.direction == null) {
                    throw new Error('Direction should be defined');
                }

                dispatch({ type: 'move', direction: ss.direction });
            }, ss.getSnakeSpeed())
        }

        return () => clearTimeout(timeout);
    }, [ss]);

    return (
        <div>
            <h1>Snake</h1>
            <div className="flex flex-col-reverse">
                {ss.grid.boxes.map((row, i) => {
                    return <div key={`row-${i}`} className="flex">
                        {row.map((box, j) => {
                            const classes: string[] = ['border', 'size-5'];

                            switch (box.status) {
                                case 'food':
                                    classes.push('bg-red-500');
                                    break;
                                case 'snake':
                                    classes.push('bg-yellow-500');
                                    break;
                            }

                            return <div key={`${box.status}-${i + j}`} className={classes.join(' ')} />;
                        })}
                    </div>
                })}
            </div>
            {!ss.isPlaying() && (
                <button onClick={() => dispatch({ type: 'play' })}>
                    <h2>Play</h2>
                </button>
            )}
            {ss.isPlaying() && <h2>Score {ss.score}</h2>}
        </div>
    );
}

