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

// корневой редюсер
const rootReducer = combineReducers({
  allorders: allordersSlice.reducer,
  orders: ordersSlice.reducer,
  userRegister: userRegisterSlice.reducer,
  userAuth: userAuthSlice.reducer,
  ingredients: ingredientsSlice.reducer,
  ingredientInfo: ingredientInfoSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer
});

// хранилище redux
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
