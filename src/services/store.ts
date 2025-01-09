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

// cохранение состояния
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (error) {
    console.error('Ошибка загрузки состояния:', error);
    return undefined;
  }
};

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (error) {
    console.error('Ошибка сохранения состояния:', error);
  }
};

// корневой редюсер
export const rootReducer = combineReducers({
  allorders: allordersSlice.reducer,
  orders: ordersSlice.reducer,
  userRegister: userRegisterSlice.reducer,
  userAuth: userAuthSlice.reducer,
  ingredients: ingredientsSlice.reducer,
  ingredientInfo: ingredientInfoSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer
});

// хранилище
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: loadState()
});

store.subscribe(() => saveState(store.getState()));

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
