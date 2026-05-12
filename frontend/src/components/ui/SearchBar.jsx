const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative h-[55px]">
    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-[55px] w-full rounded-full border border-emerald-200/15 bg-slate-900/70 px-11 text-base text-slate-100 shadow-sm backdrop-blur-md outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/25"
    />
  </div>
);

export default SearchBar;
