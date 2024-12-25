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
import React, { useEffect, useState } from 'react';

import { Modal } from '../modal/modal';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchUserProfile, setAuthChecked } from '../../slices/userAuthSlice';
import { getCookie } from '../../utils/cookie';
import { Preloader } from '../ui/preloader';

const App = () => {
  const dispatch = useDispatch(); // хук

  useEffect(() => {
    // Хук проверяющий авторизацию
    const initAuthCheck = async () => {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        dispatch(setAuthChecked(true)); // завершение авторизпации
        return;
      }

      try {
        await dispatch(fetchUserProfile()).unwrap();
      } catch {
        dispatch(setAuthChecked(true));
      }
    };

    initAuthCheck();
  }, [dispatch]);

  return (
    <Router>
      <div className='app'>
        <AppHeader />
        <Routes>
          {/* главная страница */}
          <Route path='/' element={<ConstructorPage />} />

          {/* лента заказов */}
          <Route path='/feed' element={<Feed />} />

          {/* авторизация */}
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

          {/* профиль */}
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

          {/* модалки */}
          <Route path='/feed/:number' element={<FeedOrderModal />} />
          <Route path='/ingredients/:id' element={<IngredientModal />} />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <ProfileOrderModal />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

// компонент для модального окна заказа
const FeedOrderModal = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/feed', { replace: true });
  };

  return (
    <Modal title='Order Details' onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};

const IngredientModal = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/', { replace: true });
  };

  return (
    <Modal title='Ingredient Details' onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};

const ProfileOrderModal = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/profile/orders', { replace: true });
  };

  return (
    <Modal title='Order Info' onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};
