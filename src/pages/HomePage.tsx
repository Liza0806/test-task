import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategory, setRecipes, setTotalRecipes } from '../features/recipesSlice';
import { RootState } from '../store';
import { fetchAllRecipesByLetters } from '../utils/fetchAllRecipesByLetters';
import RecipeItem from '../components/RecipeItem';
import { useNavigate } from 'react-router-dom';
import { Meal, Recipe } from '../types/types';

type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { recipes, totalRecipes, selectedCategory } = useSelector((state: RootState) => state.recipes);
  const todayRecipes = useSelector((state: RootState) => state.todayRecipes.todayRecipes); // Получаем рецепты на сегодня

  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recipesPerPage, setRecipesPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState<string>('strMeal');
  const navigate = useNavigate();

  const handleTodayRecipesClick = () => {
    navigate('/today');
  };
  
  // Дебаунс для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Дебаунс в 500 мс

    return () => clearTimeout(timer); // Очистка таймера при изменении searchQuery
  }, [searchQuery]);

  // Загрузка всех рецептов при первом заходе (если нет в localStorage)
  useEffect(() => {
    const loadAllRecipes = async () => {
      const storedRecipes = localStorage.getItem('allRecipes');

      if (storedRecipes) {
        const parsedRecipes = JSON.parse(storedRecipes);
        dispatch(setRecipes(parsedRecipes));
        dispatch(setTotalRecipes(parsedRecipes.length));
      } else {
        const allRecipes = await fetchAllRecipesByLetters();
        localStorage.setItem('allRecipes', JSON.stringify(allRecipes));
        dispatch(setRecipes(allRecipes));
        dispatch(setTotalRecipes(allRecipes.length));
      }
    };

    loadAllRecipes();
  }, [dispatch]);

  // Загрузка категорий при первом рендере
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const data = await response.json();
      setCategories(data.categories);
    };

    fetchCategories();
  }, []);

  // Получаем текущие рецепты (фильтрация по категории, поиску и пагинации)
  const getCurrentRecipes = () => {
    const allRecipes = JSON.parse(localStorage.getItem('allRecipes') || '[]');

    // Фильтрация по категории
    let filteredRecipes = selectedCategory
      ? allRecipes.filter((recipe: any) => recipe.strCategory === selectedCategory)
      : allRecipes;

    // Фильтрация по поисковому запросу и категории поиска
    if (debouncedSearchQuery) {
      filteredRecipes = filteredRecipes.filter((recipe: any) =>
        recipe[selectedSearchCategory]?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    // Пагинация
    const startIndex = (currentPage - 1) * recipesPerPage;
    const paginatedRecipes = filteredRecipes.slice(startIndex, startIndex + recipesPerPage);

    dispatch(setRecipes(paginatedRecipes));
    dispatch(setTotalRecipes(filteredRecipes.length));
  };

  // Обновляем рецепты при смене категории, страницы, количества рецептов на странице или поисковом запросе
  useEffect(() => {
    getCurrentRecipes();
  }, [selectedCategory, currentPage, recipesPerPage, debouncedSearchQuery]);

  // Обработка клика по категории
  const handleCategoryClick = (category: string) => {
    setCurrentPage(1); // Сброс при смене категории
    dispatch(setSelectedCategory(category));
  };

  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePrevPage = () => setCurrentPage((prev) => prev - 1);
  const handlePageClick = (page: number) => setCurrentPage(page);

  const handleRecipesPerPageChange = (count: number) => {
    setRecipesPerPage(count);
    setCurrentPage(1); // Сброс страницы
  };

  const generatePageNumbers = () => {
    return Array.from({ length: Math.ceil(totalRecipes / recipesPerPage) }, (_, i) => i + 1);
  };

  return (
    <div>
      <h1>Recipes</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => handleCategoryClick('')}>Все</button>
        {categories.map((category) => (
          <button
            key={category.idCategory}
            onClick={() => handleCategoryClick(category.strCategory)}
            style={{
              backgroundColor: selectedCategory === category.strCategory ? 'lightblue' : 'white',
            }}
          >
            {category.strCategory}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск..."
        />
        <select
          value={selectedSearchCategory}
          onChange={(e) => setSelectedSearchCategory(e.target.value)}
        >
          <option value="strMeal">Название</option>
          <option value="strIngredient1">Ингредиент</option>
          <option value="strArea">Страна</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => handleRecipesPerPageChange(10)}>Показывать 10 рецептов</button>
        <button onClick={() => handleRecipesPerPageChange(25)}>Показывать 25 рецептов</button>
      </div>

      <button onClick={handleTodayRecipesClick}>Мои рецепты на сегодня</button>
     

      <h2>All Recipes</h2>
      <ul>
  
        {recipes.map((recipe: Recipe) => (
          <RecipeItem
            key={recipe.idMeal}
            idMeal={recipe.idMeal}
            strMeal={recipe.strMeal}
            strMealThumb={recipe.strMealThumb}
            strCategory={recipe.strCategory}
            strArea={recipe.strArea}
          />
        ))}
      </ul>

      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>

        {generatePageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            style={{
              backgroundColor: currentPage === page ? 'lightblue' : 'white',
            }}
          >
            {page}
          </button>
        ))}

        <button onClick={handleNextPage} disabled={currentPage * recipesPerPage >= totalRecipes}>
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;
