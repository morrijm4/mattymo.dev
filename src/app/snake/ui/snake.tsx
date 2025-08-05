import { Arrow } from './arrow';
import { useCallback, useEffect, ActionDispatch } from 'react';
import { useLatest } from '../hooks/use-latest';
import { useKeyDown } from '../hooks/use-key-down';
import type { Direction } from '../point';
import { SnakeState } from '../snake-state';
import { SmallSpinner } from './spinner';
import { useScores } from '../hooks/use-scores';
import { rank } from '@/lib/rank';
import { useLocalStorage } from '../hooks/use-local-storage';

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

export type SnakeEvent = {
    type: 'play';
} | {
    type: 'move';
    direction: Direction;
};

type SnakeProps = {
    ss: SnakeState;
    dispatch: ActionDispatch<[event: SnakeEvent]>
    onSubmitScore: () => void;
}

export function Snake({ onSubmitScore, ss, dispatch }: SnakeProps) {
    const ssRef = useLatest(ss);

    const [highScore, setHighScore] = useLocalStorage('high-score');

    ss.onGameOver = ({ score }) => {
        if (score > Number(highScore)) setHighScore(score.toString());
    }

    const { scores } = useScores('day');
    const lowestDailyScore = scores?.at(-1)?.score ?? 0;
    const canSubmitScore = scores != null && (scores.length < rank.length || (ss.score > 0 && ss.score > lowestDailyScore));

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
        <>
            <h1>Snake</h1>
            <div className="flex justify-between gap-4 items-center h-6">
                <p className={`m-0 ${ss.isPlaying() ? 'invisible' : ''}`}>
                    {!ss.isInitialized() || ss.gameOver ? (
                        <button
                            className="border rounded-2xl px-2 py-1 hover:cursor-pointer"
                            onClick={() => dispatch({ type: 'play' })}
                        >
                            Play
                        </button>
                    ) : (
                        'Press any arrow key to start.'
                    )}
                </p>
                {ss.gameOver && (
                    <p className="m-0">
                        Game over! {canSubmitScore && (
                            <span onClick={onSubmitScore} className='font-bold underline hover:cursor-pointer'>Submit score</span>
                        )}
                    </p>
                )}
            </div>
            <p className='mb-0'>Score: {ss.score}</p>
            <div className='flex mb-4 items-center'>
                <p className='m-0'>High score:&nbsp;</p>
                {highScore == null ? <SmallSpinner /> : highScore}
            </div>

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
                <div className='flex gap-16'>
                    <Arrow dispatch={dispatch} ss={ss} direction='left' />
                    <Arrow dispatch={dispatch} ss={ss} direction='right' />
                </div>
                <Arrow dispatch={dispatch} ss={ss} direction='down' />


            </div>
        </>
    );
}
