import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { fetchOrders } from '../../slices/orderSlice';
import { fetchUserProfile } from '../../slices/userAuthSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    const checkAuthAndFetchOrders = async () => {
      try {
        // Проверяем авторизацию
        await dispatch(fetchUserProfile()).unwrap();
        // Загружаем заказы
        dispatch(fetchOrders());
      } catch (error) {
        console.error('Authorization or order fetching failed:', error);
      }
    };

    checkAuthAndFetchOrders();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
