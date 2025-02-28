import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from './features/recipesSlice';
import selectedRecipesReducer from './features/selectedRecipesSlice';
import todayRecipesReducer from './features/TodayRecipesSlice'

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    selectedRecipes: selectedRecipesReducer,
    todayRecipes: todayRecipesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
