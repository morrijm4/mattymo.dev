'use client';

import { useReducer } from 'react';
import { SnakeState } from "./snake-state";
import { useKeyPress } from './hooks/use-mouse-event';

type SnakeEvent = {
    type: 'play';
}

function reducer(_ss: SnakeState, event: SnakeEvent): SnakeState {
    switch (event.type) {
        case 'play':
            return new SnakeState().init();
    }
}

function log(e: KeyboardEvent) {
    console.log('keyboard event', e);
}

export default function Page() {
    const [ss, dispatch] = useReducer(reducer, new SnakeState());
    useKeyPress('up', log);

    console.log('state', ss);

    return (
        <div>
            <h1>Snake</h1>
            <button onClick={() => dispatch({ type: 'play' })}>
                Play
            </button>
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

                            return <div
                                key={`${box.status}-${i + j}`}
                                className={classes.join(' ')}
                            />;
                        })}
                    </div>
                })}
            </div>
        </div>
    );
}
