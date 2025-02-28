import axios from 'axios';

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

// export const fetchMealsByCategory = async (searchTerm: string) => {
//   const response = await axios.get(`${API_URL}/search.php?c=${searchTerm}`);
//   return {
//     recipes: response.data.meals || [], 
//   };
// };

export const fetchCategories = async () => {
  const response = await axios.get(`${API_URL}/categories.php`);
  return response.data.categories;
};

export const fetchMealsByFirstLetter= async (searchTerm: string) => {
    const response = await axios.get(`${API_URL}/search.php?f=${searchTerm}`);
    return response.data.meals || []; 
  };