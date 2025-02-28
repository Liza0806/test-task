import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRecipe, removeRecipeFromToday, loadRecipesFromLocalStorage } from '../features/TodayRecipesSlice';
import { Meal, Recipe } from '../types/types';

const TodayRecipesPage: React.FC = () => {
  const dispatch = useDispatch();
  const selectedRecipes = useSelector((state: any) => state.todayRecipes.todayRecipes);
  const ingredientsList = useSelector((state: any) => state.todayRecipes.ingredientsList);
  const todayRecipes = useSelector((state: any) => state.todayRecipes.todayRecipes);

  useEffect(() => {
    dispatch(loadRecipesFromLocalStorage());
  }, [dispatch]);

  const handleRemoveRecipeFromToday = (recipeId: string) => {
    dispatch(removeRecipeFromToday(recipeId)); // Используем новый экшен
  };

  return (
    <div>
      <h2>Recipes for Today</h2>
      <ul>
        {todayRecipes?.map((recipe: Recipe) => (
          <div key={recipe.idMeal}>
            <h3>{recipe.strMeal}</h3>
            <img src={recipe.strMealThumb} alt={recipe.strMeal} />
            <p>{recipe.strInstructions}</p>
            <button onClick={() => handleRemoveRecipeFromToday(recipe.idMeal)}>Remove</button>
          </div>
        ))}
      </ul>

      <h2>Ingredients for Today</h2>
      <ul>
        {ingredientsList.map((ingredient: any) => (
          <li key={ingredient.name}>
            {ingredient.name}: {ingredient.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodayRecipesPage;
