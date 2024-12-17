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

import { Modal } from '../modal/modal';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

// Пример функции ProtectedRoute
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = false; // Здесь добавить логику аутентификации
  return isAuthenticated ? children : <Navigate to='/login' />;
};

const App = () => (
  <Router>
    <div className='app'>
      <AppHeader />
      <Routes>
        {/* Главная страница */}
        <Route path='/' element={<ConstructorPage />} />

        {/* Страница ленты заказов */}
        <Route path='/feed' element={<Feed />} />

        {/* Защищённые маршруты */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

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

        {/* Модалки */}
        <Route
          path='/feed/:number'
          element={
            <Modal
              title='Order Details'
              onClose={() => console.log('Modal closed')}
            >
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal
              title='Ingredient Details'
              onClose={() => console.log('Modal closed')}
            >
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <Modal
                title='OrderInfo'
                onClose={() => console.log('Modal closed')}
              >
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        />

        {/* Страница 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  </Router>
);

export default App;
