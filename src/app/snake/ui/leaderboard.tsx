import { Table, Tabs } from 'nextra/components';
import {
    getScores,
    getScoresBetween,
} from '../queries/get-scores';
import { db } from '@/db/client';
import { createDateRange } from '@/lib/create-date-range';
import { rank } from '@/lib/rank';

export async function Leaderboards() {
    const [daily, weekly, monthly, allTime] = await Promise.all([
        getScoresBetween(db, createDateRange('day')),
        getScoresBetween(db, createDateRange('week')),
        getScoresBetween(db, createDateRange('month')),
        getScores(db),
    ]);

    return (
        <>
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
