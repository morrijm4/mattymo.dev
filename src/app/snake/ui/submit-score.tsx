'use client';

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import type { SnakeState } from "../snake-state";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_CHARS } from 'input-otp';
import { useActionState } from "react";
import { submitScore } from "../actions/submit-score";
import { useLocalStorage } from "../hooks/use-local-storage";

export type SubmitScoreProps = {
    ss: SnakeState;
    onBack?: () => void;
};

export const NAME_LENGTH = 3;

export function SubmitScore({ ss, onBack }: SubmitScoreProps) {
    const [name, setName] = useLocalStorage('name');
    const [, action, isPending] = useActionState(submitScore, ss.score);

    return (
        <>
            <h1>Submit score: {ss.score}</h1>
            <div className="flex justify-between gap-4">
                <p>Enter your initials.</p>
                {onBack && (
                    <button
                        className="underline hover:cursor-pointer"
                        onClick={onBack}
                    >
                        Back
                    </button>
                )}
            </div>
            <form className="flex flex-col gap-4 items-start" action={action}>
                <InputOTP
                    autoComplete="off"
                    name="name"
                    value={name}
                    onChange={(name) => setName(name.toUpperCase())}
                    maxLength={NAME_LENGTH}
                    minLength={NAME_LENGTH}
                    pattern={REGEXP_ONLY_CHARS}
                    required
                >
                    <InputOTPGroup>
                        {Array.from({ length: NAME_LENGTH }, (_, i) => (
                            <InputOTPSlot key={i} index={i} />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
                <Button
                    disabled={isPending || name?.length !== NAME_LENGTH}
                    type="submit"
                    variant="outline">
                    Submit
                </Button>
            </form >
        </>
    );
}
