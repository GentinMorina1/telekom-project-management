import React, { useEffect, useState } from "react";
import { fetchProjects } from "../api";
import ProjectItem from "./ProjectItem";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchProjects();
      setProjects(data);
    };
    loadProjects();
  }, []);

  return (
    <div>
      <h2>Projects</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <ProjectItem key={project.id} project={project} onProjectUpdated={() => setProjects([...projects])} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectList;
