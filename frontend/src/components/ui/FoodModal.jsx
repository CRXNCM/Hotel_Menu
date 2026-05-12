const FoodModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-3 sm:items-center sm:justify-center">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-4 text-slate-100">
        <img src={item.image} alt={item.name} className="h-56 w-full rounded-xl object-cover" />
        <div className="pt-4">
          <h3 className="text-xl font-semibold">{item.name}</h3>
          <p className="text-sm text-slate-300">{item.description}</p>
          <p className="mt-2 text-amber-600">Price: ${item.price}</p>
          <p className="text-sm">Ingredients: {(item.ingredients || []).join(", ") || "N/A"}</p>
          <p className="text-sm">Allergens: {(item.allergens || []).join(", ") || "N/A"}</p>
          <p className="text-sm">Spice Level: {"🌶️".repeat(item.spiceLevel || 0) || "Mild"}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-amber-400 py-2 font-semibold text-slate-900"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FoodModal;
