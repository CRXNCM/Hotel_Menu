import { resolveMediaUrl } from "../../utils/mediaUrl";

const FoodCard = ({ item, onOpen }) => (
  <article
    role="button"
    tabIndex={0}
    onClick={() => onOpen(item)}
    onKeyDown={(event) => event.key === "Enter" && onOpen(item)}
    className="group cursor-pointer rounded-2xl border border-emerald-200/20 bg-slate-900/55 p-3 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300/60 hover:shadow-xl active:scale-[0.99]"
  >
    <img
      src={resolveMediaUrl(item.image) || "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800"}
      alt={item.name}
      loading="lazy"
      className="h-44 w-full rounded-xl object-cover transition duration-500 group-hover:scale-[1.03]"
    />
    <div className="space-y-1.5 pt-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100 transition group-hover:text-amber-200">{item.name}</h3>
        <p className="font-bold text-amber-500">${item.price}</p>
      </div>
      <p className="line-clamp-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
    </div>
  </article>
);

export default FoodCard;
