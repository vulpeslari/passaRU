import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const name = localStorage.getItem('name');
    const address = localStorage.getItem('address');

    if (!name || !address) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PrivateRoute;