"use client";
import Image from "next/image";

export default function TechStackSection() {
  const techStack = [
    { name: "React", icon: "/stack-icons/ReactJS.svg" },
    { name: "Next.js", icon: "/stack-icons/NextJS.svg" },
    { name: "JavaScript", icon: "/stack-icons/Javascript.svg" },
    { name: "CSS", icon: "/stack-icons/css.svg" },
    { name: "Tailwind", icon: "/stack-icons/tailwind.svg" },
    { name: "Node.js", icon: "/stack-icons/NodeJS.svg" },
    { name: "MongoDB", icon: "/stack-icons/MongoDB.svg" },
    { name: "PostgreSQL", icon: "/stack-icons/PostgreSQL.svg" },
    { name: "Git", icon: "/stack-icons/Git.svg" },
    { name: "GitHub", icon: "/stack-icons/Github.svg" },
    { name: "Figma", icon: "/stack-icons/figma.svg" },
    { name: "Vercel", icon: "/stack-icons/Vercel.svg" },
    { name: "Framer", icon: "/stack-icons/framer.svg" },
    { name: "GSAP", icon: "/stack-icons/GSAP.svg" },
    { name: "Postman", icon: "/stack-icons/Postman.svg" },
    { name: "Python", icon: "/stack-icons/Python.svg" },
    { name: "Java", icon: "/stack-icons/Java.svg" },
    { name: "Aceternity", icon: "/stack-icons/Aceternity.svg" },
  ];

  return (
    <div className="tech-stack-container flex flex-col justify-center">
      <div className="tech-stack-title">Tech Stack</div>
      <div className="tech-stack-grid">
        {techStack.map((tech, index) => (
          <div key={index} className="tech-card flex justify-center flex-col items-center">
            <Image
              src={tech.icon}
              alt={tech.name}
              width={40}
              height={40}
              className="tech-stack-icon"
            />
            <span className="tech-stack-name">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
