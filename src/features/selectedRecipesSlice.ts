import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Тип для рецепта
interface SelectedRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  ingredients: string[];
}

// Состояние
interface SelectedRecipesState {
  selectedRecipes: SelectedRecipe[];
}

// Чтение из Local Storage при инициализации
const loadFromLocalStorage = (): SelectedRecipe[] => {
  const data = localStorage.getItem('selectedRecipes');
  return data ? JSON.parse(data) : [];
};

const initialState: SelectedRecipesState = {
  selectedRecipes: loadFromLocalStorage(),
};

// Хелпер для сохранения в LS
const saveToLocalStorage = (recipes: SelectedRecipe[]) => {
  localStorage.setItem('selectedRecipes', JSON.stringify(recipes));
};

// Слайс
const selectedRecipesSlice = createSlice({
  name: 'selectedRecipes',
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<SelectedRecipe>) => {
      const exists = state.selectedRecipes.some(recipe => recipe.idMeal === action.payload.idMeal);
      if (!exists) {
        state.selectedRecipes.push(action.payload);
        saveToLocalStorage(state.selectedRecipes); // сохраняем в LS
      }
    },
    removeRecipe: (state, action: PayloadAction<string>) => {
      state.selectedRecipes = state.selectedRecipes.filter(recipe => recipe.idMeal !== action.payload);
      saveToLocalStorage(state.selectedRecipes); // сохраняем в LS
    },
    clearSelectedRecipes: (state) => {
      state.selectedRecipes = [];
      saveToLocalStorage([]); // очищаем LS
    }
  },
});

export const { addRecipe, removeRecipe, clearSelectedRecipes } = selectedRecipesSlice.actions;
export default selectedRecipesSlice.reducer;
