import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Col, Row, Container, Modal } from 'react-bootstrap';

const Dashboard = ({ user }) => {
  // State for all projects and filtered projects
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    priority: 'Medium',
    status: 'Pending', // Default status
    comments: '',
  });

  useEffect(() => {
    // Load projects from localStorage if they exist
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    setAllProjects(savedProjects);
    setFilteredProjects(savedProjects);
  }, []);

  // Handle creating a new project
  const handleCreateProject = () => {
    if (!projectForm.name.trim()) {
      alert('Please enter a project name.');
      return;
    }

    const newProject = {
      id: allProjects.length + 1,
      ...projectForm, // Include form data
    };

    const updatedProjects = [...allProjects, newProject];
    setAllProjects(updatedProjects);
    setFilteredProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects)); // Save to localStorage

    setShowModal(false); // Close the modal after creating project
    setProjectForm({ name: '', description: '', priority: 'Medium', status: 'Pending', comments: '' }); // Reset form
  };

  // Handle updating the procurement status
  const handlePassedProcurement = (id) => {
    const updatedProjects = allProjects.map((project) =>
      project.id === id ? { ...project, status: 'Passed Procurement' } : project
    );
    setAllProjects(updatedProjects);
    setFilteredProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects)); // Save to localStorage
  };

  // Handle filtering based on priority, name, and procurement status
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const updatedProjects = allProjects.filter((project) =>
      project[name].toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(updatedProjects);
  };

  return (
    <Container>
      <h1 className="my-4">Dashboard</h1>

      {/* Project Filter */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Control
            type="text"
            name="name"
            placeholder="Search by name"
            onChange={handleFilter}
          />
        </Col>
        <Col md={4}>
          <Form.Control as="select" name="priority" onChange={handleFilter}>
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Form.Control>
        </Col>
        <Col md={4}>
          <Form.Control as="select" name="status" onChange={handleFilter}>
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Passed Procurement">Passed Procurement</option>
          </Form.Control>
        </Col>
      </Row>

      {/* Button to Open Modal */}
      <Button variant="success" onClick={() => setShowModal(true)}>New Project</Button>

      {/* Projects Table */}
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
              {user.role === 'procurement' && project.status !== 'Passed Procurement' && (
                <td>
                  <Button variant="primary" onClick={() => handlePassedProcurement(project.id)}>
                    Passed Procurement
                  </Button>
                </td>
              )}
              {user.role === 'admin' && (
                <td>
                  <Button variant="danger" className="me-2">Delete</Button>
                  <Button variant="warning">Edit</Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Creating Project */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create a New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="formProjectName">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    placeholder="Enter project name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="formProjectDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Enter description"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formProjectPriority">
                  <Form.Label>Priority</Form.Label>
                  <Form.Control
                    as="select"
                    value={projectForm.priority}
                    onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formProjectComments">
                  <Form.Label>Comments</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={projectForm.comments}
                    onChange={(e) => setProjectForm({ ...projectForm, comments: e.target.value })}
                    placeholder="Enter comments"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreateProject}>Create Project</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
