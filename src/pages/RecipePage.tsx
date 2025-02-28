import React, { useEffect, useState } from "react";
import { Meal } from "../types/types";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addRecipe, removeRecipe } from "../features/selectedRecipesSlice";
import { addRecipeToToday } from "../features/TodayRecipesSlice"; // Импортируем экшн для добавления рецепта на сегодня

export const mapApiMealToMeal = (apiMeal: any): Meal => {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = apiMeal[`strIngredient${i}`];
    if (ingredient) ingredients.push(ingredient);
  }

  return {
    idMeal: apiMeal.idMeal,
    strMeal: apiMeal.strMeal,
    strCategory: apiMeal.strCategory,
    strArea: apiMeal.strArea,
    strInstructions: apiMeal.strInstructions,
    strMealThumb: apiMeal.strMealThumb,
    strTags: apiMeal.strTags,
    strYoutube: apiMeal.strYoutube,
    ingredients,
  };
};

const RecipePage: React.FC = () => {
  const { idMeal } = useParams<{ idMeal: string }>();
  const [meal, setMeal] = useState<Meal | null>(null);
  const dispatch = useDispatch();
  const selectedRecipes = useSelector((state: any) => state.selectedRecipes.selectedRecipes);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
        );
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
          setMeal(mapApiMealToMeal(data.meals[0]));
        }
      } catch (error) {
        console.error("Failed to fetch meal", error);
      }
    };

    fetchMeal();
  }, [idMeal]);

  if (!meal) return <div>Loading...</div>;

  // Проверяем, добавлен ли рецепт в избранное
  const isRecipeInFavorites = selectedRecipes.some((recipe: Meal) => recipe.idMeal === meal.idMeal);

  const handleAddRecipe = () => {
    if (meal && !isRecipeInFavorites) {
      dispatch(
        addRecipe({
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          ingredients: meal.ingredients,
        })
      );
    }
  };

  const handleRemoveRecipe = () => {
    if (meal) {
      dispatch(removeRecipe(meal.idMeal));
    }
  };

  const handleAddToToday = () => {
    if (meal) {
      dispatch(addRecipeToToday(meal)); // Добавляем рецепт в "Приготовить сегодня"
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{meal.strMeal}</h1>
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        style={{ width: "100%", maxWidth: "600px" }}
      />
      <p>
        <strong>Категория:</strong> {meal.strCategory}
      </p>
      <p>
        <strong>Кухня:</strong> {meal.strArea}
      </p>

      <h2>Ингредиенты:</h2>
      <ul>
        {meal.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h2>Инструкция:</h2>
      <p>{meal.strInstructions}</p>

      {isRecipeInFavorites ? (
        <button onClick={handleRemoveRecipe}>Удалить из избранного</button>
      ) : (
        <button onClick={handleAddRecipe}>Добавить в избранное</button>
      )}

      <button onClick={handleAddToToday}>Приготовить сегодня</button>

      {meal.strYoutube && (
        <div>
          <h3>Видео рецепт:</h3>
          <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer">
            Смотреть на YouTube
          </a>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
