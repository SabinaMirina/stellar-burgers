import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { Navigate, useLocation } from 'react-router';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  // информация об авторизации
  const { isAuthChecked, user } = useSelector(
    (state: RootState) => state.userAuth
  );
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  // пользователь уже авторизован
  if (onlyUnAuth && user) {
    return <Navigate replace to='/profile' />;
  }

  // пользователь не авторизован
  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
