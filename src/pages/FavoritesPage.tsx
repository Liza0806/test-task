import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeRecipe } from '../features/selectedRecipesSlice';
import { Meal } from '../types/types';
import { Link } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  const selectedRecipes = useSelector((state: any) => state.selectedRecipes.selectedRecipes);
  const dispatch = useDispatch();

  const handleRemoveRecipe = (idMeal: string) => {
    dispatch(removeRecipe(idMeal));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Избранное</h1>
      {selectedRecipes.length === 0 ? (
        <p>У вас нет избранных рецептов.</p>
      ) : (
        <ul>
          {selectedRecipes.map((recipe: Meal) => (
            <li key={recipe.idMeal} style={{ marginBottom: '20px' }}>
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <div>
                <h3>{recipe.strMeal}</h3>
                <p>{recipe.strCategory} | {recipe.strArea}</p>
                <Link to={`/recipe/${recipe.idMeal}`} style={{ marginRight: '10px' }}>
                  Подробнее
                </Link>
                <button onClick={() => handleRemoveRecipe(recipe.idMeal)}>
                  Удалить из избранного
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;
