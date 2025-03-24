import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./src/pages/Home";
import Dashboard from "./src/pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
