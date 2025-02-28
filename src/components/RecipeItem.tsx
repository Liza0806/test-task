import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecipeItem.module.scss";

interface RecipeItemProps {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
}

const RecipeItem: React.FC<RecipeItemProps> = ({ idMeal, strMeal, strMealThumb, strCategory, strArea }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${idMeal}`);
  };

  return (
    <div className={styles.recipeCard} onClick={handleClick}>
      <img src={strMealThumb} alt={strMeal} className={styles.image} />
      <h3 className={styles.title}>{strMeal}</h3>
      <p className={styles.info}>
        Категория: {strCategory} | Кухня: {strArea}
      </p>
    </div>
  );
};

export default RecipeItem;
