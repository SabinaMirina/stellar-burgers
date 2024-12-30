import { getIngredientsApi } from '../utils/burger-api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../utils/types';

// тип состояния для ингредиентов
interface IngredientInfoState {
  ingredientData: TIngredient | null;
  ingredients: TIngredient[]; // список всех ингредиентов
  loading: boolean;
  error: string | null;
}

// начальное состояние
const initialState: IngredientInfoState = {
  ingredientData: null,
  ingredients: [],
  loading: false,
  error: null
};

// асинхронное действие для загрузки всех ингредиентов
export const fetchIngredientsInfo = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredient/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const response = await getIngredientsApi();
    return response;
  } catch (error) {
    return rejectWithValue(
      (error as Error).message || 'Failed to fetch ingredients'
    );
  }
});

// слайс
export const ingredientInfoSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {
    // устанавливает активный ингредиент
    setIngredientData(state, action: PayloadAction<TIngredient>) {
      state.ingredientData = action.payload;
    },
    // сбрасывает активный ингредиент
    resetIngredientData(state) {
      state.ingredientData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredientsInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredientsInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching ingredients';
      });
  }
});

export const { setIngredientData, resetIngredientData } =
  ingredientInfoSlice.actions;
