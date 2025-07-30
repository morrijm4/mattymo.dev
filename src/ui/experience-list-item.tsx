import type { ReactNode } from "react";

interface ExperienceListItemProps {
    title: string;
    date?: string;
}

export function ExperienceListItem({ title, date }: ExperienceListItemProps): ReactNode {
    return (
        <li>
            <div className="flex justify-between">
                <div>
                    {title}
                </div>
                <div>
                    {date}
                </div>
            </div>
        </li>
    );
}
