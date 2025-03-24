import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // Change to your Django backend URL

// Set token for authenticated requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// User Login
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login/`, { email, password });
    localStorage.setItem("token", response.data.token); // Store token
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};

// Fetch all projects
export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch projects";
  }
};

// Create a new project
export const createProject = async (projectData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects/`, projectData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to create project";
  }
};

// Update project priority
export const updateProjectPriority = async (projectId, priority) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/projects/${projectId}/`,
      { priority },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to update project priority";
  }
};

// Add a comment to a project
export const addProjectComment = async (projectId, comment) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/projects/${projectId}/comments/`,
      { comment },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to add comment";
  }
};

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    await axios.delete(`${API_BASE_URL}/projects/${projectId}/`, getAuthHeaders());
    return { success: true };
  } catch (error) {
    throw error.response?.data || "Failed to delete project";
  }
};
