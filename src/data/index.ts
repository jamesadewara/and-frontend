export type TeamMember = {
    name: string;
    role: string;
    image?: string;
    github?: string;
    linkedin?: string;
    x?: string;
};

const team: TeamMember[] = [
    { name: "James Ayomide Adewara", role: "Fullstack · Cloud · DevOps · AI Engineer", image: "/team/james.png", x: "https://x.com/jamesadewaradev", linkedin: "https://www.linkedin.com/in/james-adewara", github: "https://github.com/jamesadewara" },
    { name: "Esther Omole", role: "Backend Developer", image: "/team/esther.png", x: "", linkedin: "", github: "https://github.com/omoleesther" },
    { name: "Fedora", role: "Data Analyst · Report & Documentation", image: "/team/fedora.png", x: "", linkedin: "https://www.linkedin.com/in/fedora-anaba-567b812a4/", github: "" },
    { name: "Ifeoluwa", role: "Sales Marketer · Presentation Editor", image: "/team/ifeoluwa.png", x: "", linkedin: "", github: "https://sotolaifeoluwa.com/" },
];

export const TEAM = team;