import { useMemo, useState } from "react";

const MenuTable = ({ items, onEdit, onDelete }) => {
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedItems = useMemo(() => {
    const data = [...items];
    data.sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc" ? Number(a.price) - Number(b.price) : Number(b.price) - Number(a.price);
      }

      const aValue = String(a[sortBy] || "").toLowerCase();
      const bValue = String(b[sortBy] || "").toLowerCase();
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [items, sortBy, sortOrder]);

  return (
    <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">Menu Items</h3>
        <div className="flex items-center gap-2 text-sm">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-slate-100"
          >
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
            <option value="price">Sort by Price</option>
          </select>
          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-slate-100"
          >
            {sortOrder === "asc" ? "Asc" : "Desc"}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-200">
      <thead className="text-slate-400">
        <tr>
          <th className="pb-2">Name</th>
          <th className="pb-2">Category</th>
          <th className="pb-2">Price</th>
          <th className="pb-2">Status</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {sortedItems.map((item) => (
          <tr key={item._id} className="border-t border-slate-700">
            <td className="py-2">{item.name}</td>
            <td className="py-2">{item.category}</td>
            <td className="py-2">${item.price}</td>
            <td className="py-2">{item.isAvailable ? "Available" : "Unavailable"}</td>
            <td className="space-x-2 py-2 text-right">
              <button type="button" onClick={() => onEdit(item)} className="rounded bg-slate-700 px-2 py-1 text-slate-100">
                Edit
              </button>
              <button type="button" onClick={() => onDelete(item._id)} className="rounded bg-red-500/20 px-2 py-1 text-red-300">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuTable;
