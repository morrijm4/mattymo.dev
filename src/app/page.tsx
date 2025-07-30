import { ExperienceListItem } from "./ui/experience-list-item";

export default function Home() {
    return (
        <>
            <h1>Hello!👋</h1>
            <p>
                My name is Matthew Morrison. I am a software engineer, climber, guitarist, and golfer. I live in New York City and I am a graduate student at <a href="https://tech.cornell.edu/">Cornell Tech</a> earning a Master of Engineering in Computer Science degree.
            </p>
            I let my curiosity and interest direct my ambitions and I pursue my passions with great intensity. I focus on the journey and cherish what I learn from my experiences. I firmly believe I can accomplish anything when my mind is set on a goal.
            <p>
            </p>
            <p>
                Feel free to email me at <a href="mailto:j.matthew.morrison1@gmail.com">j.matthew.morrison1@gmail.com</a>.
            </p>
            <h2>Experience</h2>
            <h3>Asurion</h3>
            <p>3 years 3 months</p>
            <ul>
                <ExperienceListItem title="Tech Lead" date="Mar 2025 - Jul 2025" />
                <ExperienceListItem title="Senior Software Engineer 3" date="Sep 2024 - Mar 2025" />
                <ExperienceListItem title="Software Engineer 2" date="Sep 2023 - Nov 2024" />
                <ExperienceListItem title="Software Engineer 1" date="Sep 2022 - Sep 2023" />
                <ExperienceListItem title="Software Engineer Intern" date="May 2022 - Aug 2022" />
            </ul>
            <h2>Education</h2>
            <h3>Cornell Tech</h3>
            <p>
                Aug 2025 - May 2026
            </p>
            <p>
                Master of Engineering in Computer Science
            </p>
            <h3>Vanderbilt University</h3>
            <p>
                Aug 2018 - May 2022
            </p>
            <p>
                Bachelor of Science | Major in Computer Science; Minor in Engineering Management
            </p>
        </>
    );
}
