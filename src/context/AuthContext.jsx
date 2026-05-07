import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/admin/login" />;
};