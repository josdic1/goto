export function CategoryButtons({ categories, selectedCategory, onSelectCategory }) {

  if (!categories?.length) {
    return null;
  }

  return (
    <div className="filter-section">
      <label className="filter-label">CATEGORIES</label>
      <div className="category-buttons">
        <button
          onClick={() => onSelectCategory(null)}
          className={`category-btn ${!selectedCategory ? 'active' : ''}`}
        >
          ALL CATEGORIES
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
          >
            {cat.name}
            <span className="category-count">{cat.cheats?.length ?? 0}</span>
          </button>
        ))}
      </div>
    </div>
  );
}