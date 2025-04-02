import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Col, Row, Container, Modal } from 'react-bootstrap';

const Dashboard = ({ user }) => {
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    comments: '',
  });
  const [editingProject, setEditingProject] = useState(null); // State to track the project being edited
  const [filters, setFilters] = useState({ name: '', priority: '', status: '', createdBy: '' });

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    setAllProjects(savedProjects);
    setFilteredProjects(savedProjects);
  }, []);

  useEffect(() => {
    let projects = allProjects;
    if (filters.name) {
      projects = projects.filter((p) => p.name && p.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.priority) {
      projects = projects.filter((p) => p.priority === filters.priority);
    }
    if (filters.status) {
      projects = projects.filter((p) => p.status === filters.status);
    }
    if (filters.createdBy) {
      projects = projects.filter((p) => p.createdBy && p.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase()));
    }
    setFilteredProjects(projects);
  }, [filters, allProjects]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleCreateProject = () => {
    if (!projectForm.name.trim()) {
      alert('Please enter a project name.');
      return;
    }
    const newProject = {
      id: allProjects.length + 1,
      ...projectForm,
      createdBy: user.email,
    };
    const updatedProjects = [...allProjects, newProject];
    setAllProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setShowModal(false);
    setProjectForm({ name: '', description: '', priority: 'Medium', status: 'Pending', comments: '' });
  };

  const handleDeleteProject = (id) => {
    const updatedProjects = allProjects.filter((p) => p.id !== id);
    setAllProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const handlePassedProcurement = (id) => {
    const updatedProjects = allProjects.map((p) =>
      p.id === id ? { ...p, status: 'Passed Procurement' } : p
    );
    setAllProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  // Handle Edit Button Click
  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({ ...project });
    setShowModal(true); // Open the modal
  };

  const handleUpdateProject = () => {
    if (!projectForm.name.trim()) {
      alert('Please enter a project name.');
      return;
    }
    const updatedProjects = allProjects.map((p) =>
      p.id === editingProject.id ? { ...editingProject, ...projectForm } : p
    );
    setAllProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setShowModal(false);
    setEditingProject(null);
    setProjectForm({ name: '', description: '', priority: 'Medium', status: 'Pending', comments: '' });
  };

  return (
    <Container>
      <h1 className="my-4">Dashboard</h1>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={3}><Form.Control type="text" placeholder="Search by Name" name="name" onChange={handleFilterChange} /></Col>
        <Col md={3}><Form.Select name="priority" onChange={handleFilterChange}><option value="">Priority</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></Form.Select></Col>
        <Col md={3}><Form.Select name="status" onChange={handleFilterChange}><option value="">Status</option><option value="Pending">Pending</option><option value="Passed Procurement">Passed Procurement</option></Form.Select></Col>
        <Col md={3}><Form.Control type="text" placeholder="Filter by Creator" name="createdBy" onChange={handleFilterChange} /></Col>
      </Row>

      <Button variant="success" onClick={() => setShowModal(true)}>New Project</Button>

      <h3 className="mt-5">Project List</h3>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Comments</th>
            <th>Created By</th>
            {user.role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>{project.priority}</td>
              <td>{project.status}</td>
              <td>{project.comments}</td>
              <td>{project.createdBy}</td>
              {user.role === 'procurement' && project.status !== 'Passed Procurement' && (
                <td><Button variant="primary" onClick={() => handlePassedProcurement(project.id)}>Passed Procurement</Button></td>
              )}
              {user.role === 'admin' && (
                <td>
                  <Button variant="danger" className="me-2" onClick={() => handleDeleteProject(project.id)}>Delete</Button>
                  <Button variant="warning" onClick={() => handleEditProject(project)}>Edit</Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Create or Edit Project Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProject ? 'Edit Project' : 'Create a New Project'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control type="text" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select value={projectForm.priority} onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Form.Group>
         
            <Form.Group className="mb-3">
              <Form.Label>Comments</Form.Label>
              <Form.Control type="text" value={projectForm.comments} onChange={(e) => setProjectForm({ ...projectForm, comments: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={editingProject ? handleUpdateProject : handleCreateProject}>
            {editingProject ? 'Update Project' : 'Create Project'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
