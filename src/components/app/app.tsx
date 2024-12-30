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

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // проверка авторизации
    const initAuthCheck = async () => {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        dispatch(setAuthChecked(true));
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
      <AppRoutes />
    </Router>
  );
};

const AppRoutes = () => {
  const location = useLocation(); // Получение текущего маршрута
  const state = location.state as { backgroundLocation?: Location }; // Состояние для отображения модального окна

  return (
    <div className='app'>
      <AppHeader />
      <Routes location={state?.backgroundLocation || location}>
        {/* Главная страница */}
        <Route path='/' element={<ConstructorPage />} />

        {/* Лента заказов */}
        <Route path='/feed' element={<Feed />} />

        {/* Авторизация */}
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

        {/* Профиль пользователя */}
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

        {/* Модальные окна */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* Страница 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Если есть backgroundLocation, отображаем модальные окна */}
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Ingredient Details'
                onClose={() => window.history.back()}
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
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Order Info' onClose={() => window.history.back()}>
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
