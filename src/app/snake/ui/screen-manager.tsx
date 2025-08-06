'use client';

import { SnakeState } from '../snake-state';
import { Snake, type SnakeEvent } from './snake';
import { useReducer, useState } from "react";
import { SubmitScore } from './submit-score';

function reducer(ss: SnakeState, event: SnakeEvent): SnakeState {
    switch (event.type) {
        case 'play':
            return new SnakeState().init();
        case 'move':
            return ss.copy().move(event.direction);
    }
}

type Screen = 'submit-score' | 'snake';

export function ScreenManager() {
    const [ss, dispatch] = useReducer(reducer, new SnakeState());
    const [screen, setScreen] = useState<Screen>('snake');

    switch (screen) {
        case 'snake':
            return <Snake
                onSubmitScore={() => setScreen('submit-score')}
                ss={ss}
                dispatch={dispatch}
            />
        case 'submit-score':
            return <SubmitScore ss={ss} onBack={() => setScreen('snake')} />
    }
}
