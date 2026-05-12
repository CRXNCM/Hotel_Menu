const FILTER_TAGS = ["vegan", "vegetarian", "spicy", "gluten-free"];

const FilterBar = ({ selectedTags, setSelectedTags }) => {
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_TAGS.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => toggleTag(tag)}
          className={`rounded-full px-3 py-2 text-xs font-medium uppercase tracking-wide transition duration-300 hover:-translate-y-0.5 active:scale-95 ${
            selectedTags.includes(tag)
              ? "bg-amber-400 text-slate-900"
              : "border border-emerald-200/25 bg-slate-900/60 text-slate-100 hover:border-emerald-200/45"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
