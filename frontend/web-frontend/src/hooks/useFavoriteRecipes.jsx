import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ethionutri.favoriteRecipes';

const readStoredFavorites = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const useFavoriteRecipes = () => {
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState(
    () => new Set(readStoredFavorites())
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...favoriteRecipeIds])
      );
    } catch {
      // Ignore storage errors so the recipe page remains usable.
    }
  }, [favoriteRecipeIds]);

  const toggleFavorite = useCallback((recipeId) => {
    setFavoriteRecipeIds((previous) => {
      const next = new Set(previous);

      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }

      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (recipeId) => favoriteRecipeIds.has(recipeId),
    [favoriteRecipeIds]
  );

  return {
    favoriteRecipeIds,
    toggleFavorite,
    isFavorite,
  };
};

export default useFavoriteRecipes;