export const fetchAllRecipesByLetters = async () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const allRecipes: any[] = [];
  
    for (const letter of letters) {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
      const data = await response.json();
  
      if (data.meals) {
        allRecipes.push(...data.meals);
      }
    }
  
    return allRecipes;
  };
  