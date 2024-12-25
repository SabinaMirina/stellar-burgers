import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { fetchOrders } from '../../slices/orderSlice';
import { RootState, useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  // Доступ к redux
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.orders
  );

  // загрузка заказы
  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchOrders());
    }
  }, [dispatch, orders]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchOrders())} />
  );
};
