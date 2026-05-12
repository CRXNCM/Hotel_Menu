import FoodCard from "./FoodCard";

const FeaturedSection = ({ title, items, onOpen }) => {
  if (!items.length) return null;

  return (
    <section className="space-y-3 rounded-2xl border border-emerald-200/20 bg-slate-900/45 p-4 backdrop-blur-sm transition duration-300 hover:border-emerald-200/40">
      <h2 className="text-lg font-semibold text-amber-100">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <FoodCard key={item._id} item={item} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
