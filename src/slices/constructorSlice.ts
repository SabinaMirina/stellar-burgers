import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '../utils/types';
import { orderBurgerApi } from '../utils/burger-api';

// типы для состояния
interface BurgerConstructorState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
}

// начальное состояние
const initialState: BurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  orderError: null
};

// асинхронное действие для создания заказа
export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>(
  'burgerConstructor/createOrder',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order;
    } catch (err) {
      return rejectWithValue(
        (err as Error).message || 'Failed to create order'
      );
    }
  }
);

// слайс
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // перемещение ингредиента
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const movedItem = state.constructorItems.ingredients.splice(
        fromIndex,
        1
      )[0];
      state.constructorItems.ingredients.splice(toIndex, 0, movedItem);
    },
    // удаление ингредиента
    removeIngredient(state, action: PayloadAction<number>) {
      state.constructorItems.ingredients.splice(action.payload, 1);
    },
    setConstructorItems(
      state,
      action: PayloadAction<{
        bun: TConstructorIngredient | null;
        ingredients: TConstructorIngredient[];
      }>
    ) {
      state.constructorItems = action.payload;
    },
    resetConstructor(state) {
      state.constructorItems = { bun: null, ingredients: [] };
      state.orderModalData = null;
    },
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push(action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // загрузка заказа
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      // успешное создание заказа
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      // ошибка создания заказа
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload || 'Unknown error';
      });
  }
});

export const {
  moveIngredient,
  removeIngredient,
  setConstructorItems,
  resetConstructor,
  addIngredient
} = burgerConstructorSlice.actions;
