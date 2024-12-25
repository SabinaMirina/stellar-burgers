import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addIngredient } from '../../slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  // компонент BurgerIngredient
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      // добавление ингредиента в конструктор
      dispatch(
        addIngredient({
          ...ingredient,
          id: ingredient._id
        })
      );
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
