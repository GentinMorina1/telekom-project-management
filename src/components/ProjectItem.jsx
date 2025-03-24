import React, { useState } from "react";
import { addProjectComment, updateProjectPriority } from "../api";

const ProjectItem = ({ project, onProjectUpdated }) => {
  const [comment, setComment] = useState("");
  const [priority, setPriority] = useState(project.priority);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    await addProjectComment(project.id, comment);
    setComment("");
    onProjectUpdated();
  };

  const handlePriorityChange = async (e) => {
    const newPriority = e.target.value;
    setPriority(newPriority);
    await updateProjectPriority(project.id, newPriority);
    onProjectUpdated();
  };

  return (
    <tr>
      <td>{project.title}</td>
      <td>{project.description}</td>
      <td>
        <select value={priority} onChange={handlePriorityChange}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </td>
      <td>
        <input type="text" placeholder="Add Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
        <button onClick={handleCommentSubmit}>+</button>
      </td>
    </tr>
  );
};

export default ProjectItem;
