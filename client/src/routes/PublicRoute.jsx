
import { Navigate } from 'react-router-dom';

function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/trips" /> : children;
}

export default PublicOnlyRoute;
