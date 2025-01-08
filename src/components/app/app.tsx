import { AppHeader, IngredientDetails, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import React, { useEffect } from 'react';

import { Modal } from '../modal/modal';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { useDispatch } from '../../services/store';
import { fetchUserProfile, setAuthChecked } from '../../slices/userAuthSlice';
import { getCookie } from '../../utils/cookie';
import { Preloader } from '../ui/preloader';
import { refreshToken } from '@api';

const App = () => {
  const dispatch = useDispatch();

  const initAuthCheck = async () => {
    let accessToken = getCookie('accessToken');

    if (!accessToken) {
      console.warn('Access token отсутствует, пытаемся обновить...');
      try {
        const refreshData = await refreshToken();
        accessToken = refreshData.accessToken;
      } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
        localStorage.removeItem('refreshToken');
        dispatch(setAuthChecked(true));
        return; // Завершить проверку
      }
    }

    try {
      await dispatch(fetchUserProfile()).unwrap();
    } catch (error) {
      console.error('Ошибка проверки пользователя:', error);
    } finally {
      dispatch(setAuthChecked(true));
    }
  };

  useEffect(() => {
    initAuthCheck();
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export const AppRoutes = () => {
  const location = useLocation();
  const state = location.state as { background?: Location };
  const navigate = useNavigate();

  return (
    <div className='app'>
      <AppHeader />
      <Routes location={state?.background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {state?.background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Ingredient Details'
                onClose={() => navigate('/', { replace: true })}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Order Details'
                onClose={() => navigate('/feed', { replace: true })}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title='Order Info'
                onClose={() => navigate('/profile/orders', { replace: true })}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
