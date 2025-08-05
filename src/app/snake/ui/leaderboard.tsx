import dayjs from 'dayjs';
import { Table, Tabs } from 'nextra/components';
import { getScores, getScoresBetween } from '../queries/get-scores';
import { db } from '@/db/client';
import { SaveMinimumDailyScore } from './save-minimum-daily-score';

export async function Leaderboards() {
    const [daily, weekly, monthly, allTime] = await Promise.all([
        getScoresBetween(db, createDateRange('day')),
        getScoresBetween(db, createDateRange('week')),
        getScoresBetween(db, createDateRange('month')),
        getScores(db),
    ]);

    return (
        <>
            <SaveMinimumDailyScore score={daily.length < rank.length ? 0 : daily.at(-1)?.score ?? 0} />
            <h1 className='mt-16'>Leaderboard</h1>
            <Tabs items={['Daily', 'Weekly', 'Monthly', 'All Time']}>
                <Leaderboard rows={daily} />
                <Leaderboard rows={weekly} />
                <Leaderboard rows={monthly} />
                <Leaderboard rows={allTime} />
            </Tabs>
        </>
    );
}

type Row = {
    score?: number;
    name?: string;
};

type LeaderboardProps = {
    rows: Row[];
};

export const rank = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
const DEFAULT = {};

function Leaderboard({ rows }: LeaderboardProps) {
    while (rows.length < rank.length) {
        rows.push(DEFAULT);
    }

    return (
        <Tabs.Tab>
            <Table>
                <thead>
                    <Table.Tr>
                        <Table.Th>Rank</Table.Th>
                        <Table.Th>Score</Table.Th>
                        <Table.Th>Name</Table.Th>
                    </Table.Tr>
                </thead>
                <tbody>
                    {rows.map(({ score, name }, i) => (
                        <Table.Tr key={`${i}-${score}-${name}`}>
                            <Table.Td>{rank[i]}</Table.Td>
                            <Table.Td>{score}</Table.Td>
                            <Table.Td>{name}</Table.Td>
                        </Table.Tr>
                    ))}
                </tbody>
            </Table>
        </Tabs.Tab>
    );
}

function createDateRange(unit: dayjs.OpUnitType) {
    return {
        start: dayjs().startOf(unit).toDate(),
        end: dayjs().endOf(unit).toDate(),
    };
}
