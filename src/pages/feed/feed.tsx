import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { fetchAllOrders } from '../../slices/allOrdersSlice';
import { RootState, useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  // Извлекаем данные из стора
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.allorders
  );

  // Загружаем заказы при монтировании компонента
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchAllOrders())} />
  );
};
