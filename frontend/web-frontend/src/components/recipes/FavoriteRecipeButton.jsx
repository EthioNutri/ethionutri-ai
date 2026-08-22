const FavoriteRecipeButton = ({
  isFavorite,
  onToggle,
  size = 'medium',
}) => {
  const handleClick = (event) => {
    // Prevent the recipe card's click handler from opening the modal.
    event.stopPropagation();

    onToggle();
  };

  return (
    <button
      type="button"
      className={`recipe-favorite-btn recipe-favorite-btn-${size} ${
        isFavorite ? 'is-favorite' : ''
      }`}
      onClick={handleClick}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorite}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span aria-hidden="true">
        {isFavorite ? '♥' : '♡'}
      </span>
    </button>
  );
};

export default FavoriteRecipeButton;