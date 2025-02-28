export interface Meal {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strMealThumb: string;
    strTags?: string;
    strYoutube?: string;
    ingredients: string[];
}

export interface Recipe {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strMealThumb: string;
    [key: string]: any;
  }
  
  export interface RecipesState {
    allRecipes: Recipe[];
    recipes: Recipe[];
    status: "idle" | "loading" | "succeeded" | "failed";
    totalRecipes: number;
    recipesPerPage: number;
    selectedCategory: string;
    page: number;
    ingredientQuantities: { [recipeId: string]: string[] }; // Added field to track ingredient quantities
  }