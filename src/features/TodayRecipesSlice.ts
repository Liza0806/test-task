import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Meal, Recipe } from '../types/types';

interface Ingredient {
  name: string;
  quantity: string;
}

interface TodayRecipesState {
  selectedRecipes: Recipe[]; // Все избранные рецепты
  ingredientsList: Ingredient[]; // Список всех ингредиентов для выбранных рецептов
  todayRecipes: Recipe[]; // Рецепты, которые будут готовиться сегодня
}

const initialState: TodayRecipesState = {
  selectedRecipes: [],
  ingredientsList: [],
  todayRecipes: [], // Новый массив для сегодняшних рецептов
};

const todayRecipesSlice = createSlice({
  name: 'todayRecipes',
  initialState,
  reducers: {
    // Добавить рецепт в список избранных
    addRecipe(state, action: PayloadAction<Meal>) {
      const recipe: Recipe = mapMealToRecipe(action.payload);
      state.selectedRecipes.push(recipe);
      state.ingredientsList = combineIngredients(state.selectedRecipes);
      saveToLocalStorage(state.selectedRecipes);
    },
    // Удалить рецепт из списка избранных
    removeRecipe(state, action: PayloadAction<string>) {
      state.selectedRecipes = state.selectedRecipes.filter(recipe => recipe.idMeal !== action.payload);
      state.ingredientsList = combineIngredients(state.selectedRecipes);
      saveToLocalStorage(state.selectedRecipes);
    },
    // Загрузить рецепты из локального хранилища при старте приложения
    loadRecipesFromLocalStorage(state) {
      const savedRecipes = loadFromLocalStorage();
      if (savedRecipes) {
        state.selectedRecipes = savedRecipes;
        state.ingredientsList = combineIngredients(savedRecipes);
      }
    },
    // Добавить рецепт в список "Приготовить сегодня"
    addRecipeToToday(state, action: PayloadAction<Meal>) {
      const recipe: Recipe = mapMealToRecipe(action.payload);
      state.todayRecipes.push(recipe);
      state.ingredientsList = combineIngredients(state.selectedRecipes.concat(state.todayRecipes)); // Обновляем список ингредиентов
      saveToLocalStorage(state.selectedRecipes.concat(state.todayRecipes)); // Сохраняем в локальное хранилище
    },
    // Удалить рецепт из списка "Приготовить сегодня"
    removeRecipeFromToday(state, action: PayloadAction<string>) {
      const recipeId = action.payload;
      const recipeToRemove = state.todayRecipes.find(recipe => recipe.idMeal === recipeId);
      
      if (recipeToRemove) {
        state.todayRecipes = state.todayRecipes.filter(recipe => recipe.idMeal !== recipeId);
        
        // Обновляем список ингредиентов, удаляя ингредиенты, которые были в удаленном рецепте
        const updatedIngredients = removeIngredients(state.ingredientsList, recipeToRemove.ingredients);
        state.ingredientsList = updatedIngredients;
        
        saveToLocalStorage(state.selectedRecipes.concat(state.todayRecipes)); // Сохраняем в локальное хранилище
      }
    },
  },
});

// Функция для преобразования Meal в Recipe
const mapMealToRecipe = (meal: Meal): Recipe => {
  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strCategory: meal.strCategory,
    strMealThumb: meal.strMealThumb,
    strInstructions: meal.strInstructions,
    strYoutube: meal.strYoutube || '',
    ingredients: meal.ingredients.map((ingredient, index) => ({
      name: ingredient,
      //@ts-ignore
      quantity: meal[`strMeasure${index + 1}`] || '',
    })),
  };
};

// Функция для комбинирования ингредиентов
const combineIngredients = (recipes: Recipe[]): Ingredient[] => {
  const ingredientMap: { [key: string]: number } = {};

  recipes.forEach(recipe => {
    recipe.ingredients.forEach((ingredient: any) => {
      if (ingredientMap[ingredient.name]) {
        ingredientMap[ingredient.name] += parseFloat(ingredient.quantity);
      } else {
        ingredientMap[ingredient.name] = parseFloat(ingredient.quantity);
      }
    });
  });

  // Преобразуем объект обратно в массив
  return Object.entries(ingredientMap).map(([name, quantity]) => ({ name, quantity: quantity.toString() }));
};

// Функция для удаления ингредиентов
const removeIngredients = (ingredients: Ingredient[], recipeIngredients: Ingredient[]): Ingredient[] => {
  const updatedIngredients = [...ingredients];

  recipeIngredients.forEach(recipeIngredient => {
    const ingredientIndex = updatedIngredients.findIndex(ingredient => ingredient.name === recipeIngredient.name);

    if (ingredientIndex !== -1) {
      const existingIngredient = updatedIngredients[ingredientIndex];
      const newQuantity = parseFloat(existingIngredient.quantity) - parseFloat(recipeIngredient.quantity);

      if (newQuantity <= 0) {
        updatedIngredients.splice(ingredientIndex, 1); // Удаляем ингредиент, если его количество становится <= 0
      } else {
        existingIngredient.quantity = newQuantity.toString(); // Обновляем количество ингредиента
      }
    }
  });

  return updatedIngredients;
};

// Функция для сохранения в локальное хранилище
const saveToLocalStorage = (recipes: Recipe[]) => {
  localStorage.setItem('selectedTodayRecipes', JSON.stringify(recipes));
};

// Функция для загрузки из локального хранилища
const loadFromLocalStorage = (): Recipe[] | null => {
  const recipes = localStorage.getItem('selectedTodayRecipes');
  return recipes ? JSON.parse(recipes) : null;
};

export const { addRecipe, removeRecipe, loadRecipesFromLocalStorage, addRecipeToToday, removeRecipeFromToday } = todayRecipesSlice.actions;
export default todayRecipesSlice.reducer;
