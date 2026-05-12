const UploadForm = ({ form, setForm, categories, onSubmit, editMode }) => (
  <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
    <h3 className="text-lg font-semibold">{editMode ? "Edit Menu Item" : "Create Menu Item"}</h3>
    <div className="grid gap-2 sm:grid-cols-2">
      <input
        required
        value={form.name}
        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
        placeholder="Dish name"
      />
      <input
        required
        type="number"
        value={form.price}
        onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
        placeholder="Price"
      />
      <input
        required
        value={form.description}
        onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 sm:col-span-2"
        placeholder="Description"
      />
      <select
        value={form.category}
        onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
      >
        <option value="">Select category</option>
        {categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.files[0] || null }))}
        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:py-1 file:text-slate-100"
      />
      <input
        value={form.tags}
        onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 sm:col-span-2"
        placeholder="Tags (comma separated)"
      />
      <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm">
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(event) => setForm((prev) => ({ ...prev, isFeatured: event.target.checked }))}
        />
        Featured
      </label>
      <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm">
        <input
          type="checkbox"
          checked={form.isAvailable}
          onChange={(event) => setForm((prev) => ({ ...prev, isAvailable: event.target.checked }))}
        />
        Available
      </label>
      <button type="submit" className="rounded-xl bg-amber-400 px-3 py-2 font-semibold text-slate-900 sm:col-span-2">
        {editMode ? "Update Item" : "Create Item"}
      </button>
    </div>
  </form>
);

export default UploadForm;
