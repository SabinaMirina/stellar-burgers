import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TOrder, TIngredient } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { RootState } from '../../services/store';
import {
  fetchIngredientsInfo,
  setIngredientData
} from '../../slices/ingredienInfotSlice';

// получение номеров заказов по статусу
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20); // ограничение списка 20 заказами

export const FeedInfo: FC = () => {
  const dispatch = useDispatch();

  // Получаем данные из redux
  const { ingredients, loading, error } = useSelector(
    (state: RootState) => state.ingredientInfo
  );

  const orders: TOrder[] = []; // Заглушка для заказов
  const feed = {}; // Заглушка для фида

  // обработчик клика на ингредиент
  const onIngredientClick = (ingredientInfo: TIngredient) => {
    dispatch(setIngredientData(ingredientInfo));
  };

  // список номеров заказов со статусом гтово
  const readyOrders = getOrders(orders, 'done');

  // список номеров заказов со статусом в процессе
  const pendingOrders = getOrders(orders, 'pending');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
