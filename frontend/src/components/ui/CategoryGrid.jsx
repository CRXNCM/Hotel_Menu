const CategoryGrid = ({ categories, activeCategory, onSelect }) => (
  <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <button
      type="button"
      onClick={() => onSelect("")}
      className={`snap-start shrink-0 rounded-xl px-4 py-3 text-sm font-medium transition duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${
        activeCategory === ""
          ? "bg-amber-400 text-slate-900"
          : "border border-emerald-200/20 bg-slate-900/60 text-slate-100 hover:border-emerald-200/45"
      }`}
    >
      All
    </button>
    {categories.map((category) => (
      <button
        key={category._id || category.name}
        type="button"
        onClick={() => onSelect(category.name)}
        className={`snap-start shrink-0 rounded-xl px-4 py-3 text-sm font-medium transition duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${
          activeCategory === category.name
            ? "bg-amber-400 text-slate-900"
            : "border border-emerald-200/20 bg-slate-900/60 text-slate-100 hover:border-emerald-200/45"
        }`}
      >
        {category.name}
      </button>
    ))}
  </div>
);

export default CategoryGrid;
