import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import roles from '../roles.json'; // Import roles.json file

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Find the user in the roles JSON
    const user = roles.find(u => u.email === email && u.password === password);

    if (user) {
      onLogin(user); // Pass the user data (email, role) to the parent component
      localStorage.setItem("user", JSON.stringify(user)); // Store user data in localStorage
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
