import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientsSlice } from '../slices/ingredientsSlice';
import { burgerConstructorSlice } from '../slices/constructorSlice';
import { ingredientInfoSlice } from '../slices/ingredienInfotSlice';
import { userRegisterSlice } from '../slices/registerSlice';
import { ordersSlice } from '../slices/orderSlice';
import { userAuthSlice } from '../slices/userAuthSlice';
import { allordersSlice } from '../slices/allOrdersSlice';

// Сохранение части состояния
const loadState = (): Partial<RootState> | undefined => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (error) {
    console.error('Ошибка загрузки состояния:', error);
    return undefined;
  }
};

// Сохранение только нужных частей состояния
const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify({
      userAuth: state.userAuth // Только userAuth сохраняется
    });
    localStorage.setItem('reduxState', serializedState);
  } catch (error) {
    console.error('Ошибка сохранения состояния:', error);
  }
};

// Корневой редюсер
export const rootReducer = combineReducers({
  allorders: allordersSlice.reducer,
  orders: ordersSlice.reducer,
  userRegister: userRegisterSlice.reducer,
  userAuth: userAuthSlice.reducer,
  ingredients: ingredientsSlice.reducer,
  ingredientInfo: ingredientInfoSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer
});

// Хранилище
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: loadState() // Предзагрузка состояния
});

store.subscribe(() => {
  saveState(store.getState()); // Сохраняем состояние при изменениях
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
