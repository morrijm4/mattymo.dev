'use client';

import { useReducer } from "react";
import { useLatest } from "../snake/hooks/use-latest";

function reducer(state: State) {
    return state;
}

class State {
    name = 'matthew'

    getFullName() {
        return this.name + ' morrison'
    }
}

export default function Page() {
    const [state, dispatch] = useReducer(reducer, new State());
    const ref = useLatest(state);


    return (
        <>
            <h1>My name is {ref.current.getFullName()}</h1>
            <button onClick={dispatch}>Click me</button>
        </>
    );
}
