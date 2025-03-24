import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, allowedRoles, component: Component }) => {
  return allowedRoles.includes(role) ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
