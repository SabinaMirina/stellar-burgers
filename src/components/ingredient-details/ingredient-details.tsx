import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { RootState, useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { setIngredientData } from '../../slices/ingredienInfotSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );
  const ingredientData = useSelector(
    (state: RootState) => state.ingredientInfo.ingredientData
  );

  useEffect(() => {
    if (id && ingredients.length > 0) {
      const foundIngredient = ingredients.find(
        (ingredient) => ingredient._id === id
      );
      if (foundIngredient) {
        dispatch(setIngredientData(foundIngredient));
      }
    }
  }, [id, ingredients, dispatch]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
