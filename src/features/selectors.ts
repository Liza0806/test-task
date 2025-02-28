import { RootState } from '../store';

// Селектор для получения всех ингредиентов из выбранных рецептов
export const selectCombinedIngredients = (state: RootState): Record<string, number> => {
  const allIngredients: Record<string, number> = {};

  state.selectedRecipes.selectedRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      if (allIngredients[ingredient]) {
        allIngredients[ingredient] += 1;
      } else {
        allIngredients[ingredient] = 1;
      }
    });
  });

  return allIngredients;
};
