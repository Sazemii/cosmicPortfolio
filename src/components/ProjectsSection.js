"use client";
import Image from "next/image";

export default function ProjectsSection({
  projects,
  activePage,
  handlePageClick,
  handlePreviousPage,
  handleNextPage,
}) {
  const currentProject = projects[activePage - 1];

  return (
    <div className="projects flex flex-col flex-center items-center">
      <div className="project-header">My Projects</div>
      <div className="project-container flex flex-col">
        <div className="project-title">{currentProject.name}</div>
        <div className="project-description   ">
          {currentProject.description}
        </div>
        <div className="project-photo">
          <Image
            src={currentProject.image}
            alt={currentProject.name}
            width={1000}
            height={600}
            className="project-img"
            priority={true}
            sizes="(max-width: 900px) 100vw, (max-width: 1200px) 80vw, 70vw"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="tech-used flex">
          {currentProject.tools.map((tool, index) => (
            <div key={index} className="tech-item flex">
              <Image
                src={tool.icon}
                alt={tool.name}
                width={20}
                height={20}
                className="s-icon"
              />
              <span className="tech-title">{tool.name}</span>
            </div>
          ))}
        </div>
        <div className="pagination flex justify-center items-center gap-[.3rem]">
          <div
            className={`pagination-icon ${
              activePage === 1 ? "disabled" : ""
            }`}
            onClick={handlePreviousPage}
          >
            <Image
              src="/icons/previouspage.svg"
              alt="previous page"
              width={25}
              height={25}
            />
          </div>
          {projects.map((_, index) => (
            <span
              key={index + 1}
              className={`page-number ${
                activePage === index + 1 ? "active" : ""
              }`}
              onClick={() => handlePageClick(index + 1)}
            >
              {index + 1}
            </span>
          ))}

          <div
            className={`pagination-icon ${
              activePage === projects.length ? "disabled" : ""
            }`}
            onClick={handleNextPage}
          >
            <Image
              src="/icons/nextpage.svg"
              alt="next page"
              width={25}
              height={25}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
