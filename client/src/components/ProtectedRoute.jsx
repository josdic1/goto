import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }) {
    const { loggedIn, loading } = useAuth();
    
    // Wait for session check to complete
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!loggedIn) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}