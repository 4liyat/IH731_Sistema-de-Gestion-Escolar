import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user } = useAuth();

  // ATENCIÓN: Esta línea ha sido comentada TEMPORALMENTE para la demostración.
  // En un entorno real, esta línea debe estar activa para proteger las rutas:
  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />;
}