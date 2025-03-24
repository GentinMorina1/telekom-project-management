import React, { useState } from "react";
import { createProject } from "../api";
import "../style/ProjectForm.css";

const ProjectForm = ({ onProjectAdded, onClose }) => {
  const [project, setProject] = useState({ title: "", description: "", priority: "Medium" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project.title.trim()) return alert("Project title is required!");

    try {
      const newProject = await createProject(project);
      onProjectAdded(newProject);
      onClose();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="project-form">
      <h2>Add New Project</h2>
      <input type="text" name="title" placeholder="Project Title" value={project.title} onChange={handleChange} />
      <textarea name="description" placeholder="Project Description" value={project.description} onChange={handleChange}></textarea>
      <select name="priority" value={project.priority} onChange={handleChange}>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <button onClick={handleSubmit}>Create Project</button>
      <button className="cancel" onClick={onClose}>Cancel</button>
    </div>
  );
};

export default ProjectForm;
