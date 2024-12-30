import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { createOrder, resetConstructor } from '../../slices/constructorSlice';
import { BurgerConstructorUI } from '@ui';
import { useNavigate, useLocation } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // данные из Redux Store
  const { constructorItems, orderRequest, orderModalData } = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const { user } = useSelector((state: RootState) => state.userAuth);

  // функция оформления заказа
  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/' } } }); // Сохраняем маршрут конструктора
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id)
    ];

    dispatch(createOrder(ingredientIds));

    // Устанавливаем backgroundLocation для модального окна
    navigate('/order-confirmation', {
      state: { backgroundLocation: location }
    });
  };

  // закрытие модального окна
  const closeOrderModal = () => {
    dispatch(resetConstructor());
    navigate('/', { replace: true }); // Возврат на главную страницу
  };

  // Расчет цены
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
