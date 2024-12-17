import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

interface ConstructorState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: {
    orderId: string;
    orderName: string;
  } | null;
}

const initialState: ConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setConstructorItems(
      state,
      action: PayloadAction<{
        bun: TConstructorIngredient;
        ingredients: TConstructorIngredient[];
      }>
    ) {
      state.constructorItems = action.payload;
    },
    setOrderRequest(state, action: PayloadAction<boolean>) {
      state.orderRequest = action.payload;
    },
    setOrderModalData(
      state,
      action: PayloadAction<{ orderId: string; orderName: string } | null>
    ) {
      state.orderModalData = action.payload;
    }
  }
});

export const { setConstructorItems, setOrderRequest, setOrderModalData } =
  constructorSlice.actions;

export default constructorSlice.reducer;
