import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import FavoritesPage from './pages/FavoritesPage';
import TodayRecipesPage from './pages/TodayRecipesPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recipe/:idMeal" element={<RecipePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/today" element={<TodayRecipesPage />} />
            </Routes>
        </Router>
    );
};

export default App;
