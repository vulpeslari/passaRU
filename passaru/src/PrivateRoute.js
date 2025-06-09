import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const name = localStorage.getItem('authName');
    const address = localStorage.getItem('authAddress');

    if (!isAuthenticated || !name || !address) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PrivateRoute;