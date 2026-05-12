const CategoryManager = ({ categories, form, setForm, onSave, onDelete }) => (
  <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
    <h3 className="mb-2 font-semibold">Category Management</h3>
    <div className="grid gap-2 sm:grid-cols-3">
      <input
        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
        value={form.name}
        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        placeholder="Category name"
      />
      <input
        type="number"
        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
        value={form.order}
        onChange={(event) => setForm((prev) => ({ ...prev, order: Number(event.target.value) }))}
        placeholder="Order"
      />
      <button type="button" onClick={onSave} className="rounded-xl bg-amber-400 px-3 py-2 font-semibold text-slate-900">
        Save Category
      </button>
    </div>
    <ul className="mt-3 space-y-2 text-sm">
      {categories.map((category) => (
        <li key={category._id} className="flex items-center justify-between rounded bg-slate-800 px-3 py-2">
          <span>
            {category.name} ({category.order})
          </span>
          <button
            type="button"
            onClick={() => onDelete(category._id)}
            className="rounded bg-red-500/20 px-2 py-1 text-red-300"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  </section>
);

export default CategoryManager;
