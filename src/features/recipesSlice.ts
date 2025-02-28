import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchMealsByFirstLetter } from "../services/api";
import { Recipe, RecipesState } from "../types/types";

// Асинхронная загрузка всех рецептов по буквам (при первом запуске или очистке кэша)
export const fetchAllRecipes = createAsyncThunk<Recipe[]>(
  "recipes/fetchAllRecipes",
  async () => {
    const savedRecipes = localStorage.getItem("allRecipes");
    if (savedRecipes) {
      return JSON.parse(savedRecipes) as Recipe[];
    }

    let allRecipes: Recipe[] = [];
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    for (const letter of alphabet) {
      const response = await fetchMealsByFirstLetter(letter);
      const recipes = response || [];
      allRecipes = [...allRecipes, ...recipes];
    }

    localStorage.setItem("allRecipes", JSON.stringify(allRecipes));

    return allRecipes;
  }
);

const initialState: RecipesState = {
  allRecipes: [],
  recipes: [],
  status: "idle",
  totalRecipes: 0,
  recipesPerPage: 10,
  selectedCategory: "все",
  page: 1,
  ingredientQuantities: {},
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
      state.page = 1; // Сбросить страницу при смене категории
    },
    setRecipesPerPage(state, action: PayloadAction<number>) {
      state.recipesPerPage = action.payload;
      state.page = 1; // Сбросить страницу при смене кол-ва рецептов на странице
    },
    setRecipesPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    updatePaginatedRecipes(state) {
      // Обновляем рецепты на текущей странице (если выбрана категория "все" или ничего)
      if (!state.selectedCategory || state.selectedCategory === "все") {
        const startIndex = (state.page - 1) * state.recipesPerPage;
        const endIndex = startIndex + state.recipesPerPage;
        state.recipes = state.allRecipes.slice(startIndex, endIndex);
        state.totalRecipes = state.allRecipes.length;
      }
    },
    setRecipes(state, action: PayloadAction<Recipe[]>) {
      state.recipes = action.payload;
    },
    setTotalRecipes(state, action: PayloadAction<number>) {
      state.totalRecipes = action.payload;
    },
    // New reducer to handle adding ingredient quantity
    addIngredientQuantity(state, action: PayloadAction<{ recipeId: string; quantity: string }>) {
      const { recipeId, quantity } = action.payload;
      if (!state.ingredientQuantities[recipeId]) {
        state.ingredientQuantities[recipeId] = [];
      }
      state.ingredientQuantities[recipeId].push(quantity);
    },
    // New reducer to handle removing ingredient quantity
    removeIngredientQuantity(state, action: PayloadAction<{ recipeId: string; quantity: string }>) {
      const { recipeId, quantity } = action.payload;
      if (state.ingredientQuantities[recipeId]) {
        state.ingredientQuantities[recipeId] = state.ingredientQuantities[recipeId].filter(
          (ingredientQuantity) => ingredientQuantity !== quantity
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRecipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allRecipes = action.payload;
        state.totalRecipes = action.payload.length;
        const startIndex = (state.page - 1) * state.recipesPerPage;
        state.recipes = action.payload.slice(
          startIndex,
          startIndex + state.recipesPerPage
        );
      })
      .addCase(fetchAllRecipes.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const {
  setSelectedCategory,
  setRecipesPerPage,
  setRecipesPage,
  updatePaginatedRecipes,
  setRecipes,
  setTotalRecipes,
  addIngredientQuantity,
  removeIngredientQuantity,
} = recipesSlice.actions;

export default recipesSlice.reducer;
