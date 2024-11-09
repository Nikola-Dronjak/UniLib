import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    allowedRoles: string[];
    userRole: string | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, allowedRoles, userRole }) => {
    if (!isAuthenticated || !allowedRoles.includes(userRole || '')) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;