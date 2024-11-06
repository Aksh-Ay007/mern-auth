import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = Cookies.get('access_token');

  // Check for both currentUser and token
  if (!currentUser && !token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;