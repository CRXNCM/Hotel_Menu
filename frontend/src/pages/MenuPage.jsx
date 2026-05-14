import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/ui/Navbar";
import CategoryGrid from "../components/ui/CategoryGrid";
import FilterBar from "../components/ui/FilterBar";
import SearchBar from "../components/ui/SearchBar";
import FoodCard from "../components/ui/FoodCard";
import FoodModal from "../components/ui/FoodModal";
import FeaturedSection from "../components/ui/FeaturedSection";
import hotelLogo from "../assets/logo black.png";
import hotelcover from "../assets/hotelcover.png";
import hotelgallery1 from "../assets/hotelgallery.png";
import hotelgallery2 from "../assets/hotelgallery2.png";
import hotelgallery3 from "../assets/hotelgallery3.png";
import hotelgallery4 from "../assets/hotelgallery4.png";
import { getText, SUPPORTED_LANGUAGES } from "../utils/i18n";

const GALLERY_IMAGES = [hotelgallery1, hotelgallery2, hotelgallery3, hotelgallery4];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(() => localStorage.getItem("guest-language") || "en");
  const [connectionStatus, setConnectionStatus] = useState(navigator.onLine ? "online" : "offline");

  const tableNumber = searchParams.get("table");
  const roomNumber = searchParams.get("room");
  const queryLanguage = searchParams.get("lang");

  useEffect(() => {
    if (queryLanguage && SUPPORTED_LANGUAGES.includes(queryLanguage)) {
      setLanguage(queryLanguage);
    }
  }, [queryLanguage]);

  useEffect(() => {
    localStorage.setItem("guest-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [menuResponse, categoriesResponse] = await Promise.all([
          api.get("/menu"),
          api.get("/categories"),
        ]);
        const nextItems = menuResponse.data || [];
        const nextCategories = categoriesResponse.data || [];
        setItems(nextItems);
        setCategories(nextCategories);
        localStorage.setItem("cached-menu-items", JSON.stringify(nextItems));
        localStorage.setItem("cached-menu-categories", JSON.stringify(nextCategories));
      } catch {
        try {
          const cachedItems = JSON.parse(localStorage.getItem("cached-menu-items") || "[]");
          const cachedCategories = JSON.parse(localStorage.getItem("cached-menu-categories") || "[]");
          setItems(cachedItems);
          setCategories(cachedCategories);
        } catch {
          setItems([]);
          setCategories([]);
        }
        setConnectionStatus("offline");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const setOnline = () => setConnectionStatus("online");
    const setOffline = () => setConnectionStatus("offline");
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);
    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  const labels = useMemo(
    () => ({
      smartDining: getText(language, "smartDining"),
      hotelName: getText(language, "hotelName"),
      menu: getText(language, "menu"),
      hotelInfo: getText(language, "hotelInfo"),
      explore: getText(language, "explore"),
      heroBadge: getText(language, "heroBadge"),
      heroTitle: getText(language, "heroTitle"),
      heroDescription: getText(language, "heroDescription"),
      heroLobby: getText(language, "heroLobby"),
      heroSignature: getText(language, "heroSignature"),
      heroRooftop: getText(language, "heroRooftop"),
      chefCurated: getText(language, "chefCurated"),
      smartMenuTitle: getText(language, "smartMenuTitle"),
      smartMenuDescription: getText(language, "smartMenuDescription"),
      chefsPicks: getText(language, "chefsPicks"),
      popularToday: getText(language, "popularToday"),
      searchPlaceholder: getText(language, "searchPlaceholder"),
      qrRoom: getText(language, "qrRoom"),
      qrTable: getText(language, "qrTable"),
      offlineMode: getText(language, "offlineMode"),
      onlineMode: getText(language, "onlineMode"),
      language: getText(language, "language"),
      aboutOurHotel: getText(language, "aboutOurHotel"),
      exploreHotel: getText(language, "exploreHotel"),
      gallery: getText(language, "gallery"),
    }),
    [language]
  );

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const byCategory = !activeCategory || item.category === activeCategory;
        const bySearch = item.name.toLowerCase().includes(search.toLowerCase());
        const byTags = selectedTags.every((tag) => item.tags?.includes(tag));
        return byCategory && bySearch && byTags;
      }),
    [items, activeCategory, search, selectedTags]
  );

  const featured = filteredItems.filter((item) => item.isFeatured).slice(0, 3);

  return (
    <main className="min-h-screen scroll-smooth bg-gradient-to-b from-black via-slate-950 to-emerald-950/70 text-slate-100">
      <Navbar language={language} onLanguageChange={setLanguage} labels={labels} />
      <section
        id="hero"
        className="relative flex min-h-[90vh] min-h-[min(92dvh,40rem)] flex-col justify-end overflow-hidden border-b border-emerald-200/10 bg-cover bg-center bg-no-repeat px-4 pb-4 pt-[4.5rem] sm:min-h-[78vh] sm:px-6 sm:pb-8 sm:pt-24 lg:min-h-[86vh]"
        style={{ backgroundImage: `url(${hotelcover})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/35" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10 mx-auto w-full max-w-6xl pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-0"
        >
          <div className="flex flex-col gap-4 rounded-3xl border border-emerald-200/20 bg-black/35 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-7">
            <div className="min-w-0 flex-1 space-y-2.5 sm:space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-amber-300 sm:text-sm sm:tracking-[0.2em]">
                {labels.heroBadge}
              </p>
              <h1 className="text-balance text-2xl font-semibold leading-[1.15] text-amber-50 sm:text-4xl sm:leading-tight md:text-5xl">
                {labels.heroTitle}
              </h1>
              <p className="text-sm leading-relaxed text-slate-200 sm:text-base">{labels.heroDescription}</p>
              {(roomNumber || tableNumber) && (
                <div className="flex flex-wrap gap-2 text-[11px] sm:text-sm">
                  {roomNumber && (
                    <span className="rounded-xl border border-amber-300/40 bg-black/45 px-2.5 py-1.5 text-amber-100 sm:px-3 sm:py-2">
                      {labels.qrRoom}: {roomNumber}
                    </span>
                  )}
                  {tableNumber && (
                    <span className="rounded-xl border border-amber-300/40 bg-black/45 px-2.5 py-1.5 text-amber-100 sm:px-3 sm:py-2">
                      {labels.qrTable}: {tableNumber}
                    </span>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 gap-2 text-xs text-slate-100 sm:grid-cols-3 sm:text-sm">
                <span className="rounded-xl border border-emerald-300/30 bg-black/40 px-2.5 py-2 sm:px-3">
                  {labels.heroLobby}
                </span>
                <span className="rounded-xl border border-emerald-300/30 bg-black/40 px-2.5 py-2 sm:px-3">
                  {labels.heroSignature}
                </span>
                <span className="rounded-xl border border-emerald-300/30 bg-black/40 px-2.5 py-2 sm:px-3">
                  {labels.heroRooftop}
                </span>
              </div>
            </div>
            <img
              src={hotelLogo}
              alt="Just Hotel luxury logo"
              loading="lazy"
              className="mx-auto h-24 w-24 shrink-0 self-center rounded-full border border-emerald-200/30 object-cover shadow-2xl shadow-black/60 sm:mx-0 sm:h-36 sm:w-36 sm:self-auto"
            />
          </div>
        </motion.div>
      </section>
      <motion.section
        id="menu-content"
        className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={fadeUpVariants}
          whileHover={{ scale: 1.01, y: -2 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="rounded-2xl border border-amber-300/30 bg-gradient-to-r from-black/80 via-slate-900/80 to-emerald-950/70 p-5 text-white shadow-lg shadow-black/40 backdrop-blur-md"
        >
          <p className="text-amber-300">{labels.chefCurated}</p>
          <h2 className="text-2xl font-semibold tracking-wide text-amber-100">{labels.smartMenuTitle}</h2>
          <p className="text-sm text-slate-200">{labels.smartMenuDescription}</p>
          <p className="pt-1 text-xs text-emerald-100/90">
            {connectionStatus === "offline" ? labels.offlineMode : labels.onlineMode}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUpVariants}
          className="sticky top-[70px] z-30 space-y-3 rounded-2xl border border-emerald-200/10 bg-slate-950/35 p-3 backdrop-blur-xl sm:p-4"
        >
          <SearchBar value={search} onChange={setSearch} placeholder={labels.searchPlaceholder} />

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`category-skeleton-${index}`}
                  className="h-11 animate-pulse rounded-xl border border-slate-700/70 bg-slate-800/70"
                />
              ))}
            </div>
          ) : (
            <div className="sticky top-[125px]">
              <CategoryGrid categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
            </div>
          )}

          {loading ? (
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`filter-skeleton-${index}`} className="h-8 w-20 animate-pulse rounded-full bg-slate-800/75" />
              ))}
            </div>
          ) : (
            <FilterBar selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
          )}
        </motion.div>

        <motion.div variants={fadeUpVariants}>
          <FeaturedSection title={labels.chefsPicks} items={loading ? [] : featured} onOpen={setSelectedItem} />
        </motion.div>
        <motion.section variants={fadeUpVariants} className="space-y-3">
          <h2 className="text-lg font-semibold text-amber-100">{labels.popularToday}</h2>
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`card-skeleton-${index}`}
                  className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-900/60 p-3"
                >
                  <div className="h-40 animate-pulse rounded-xl bg-slate-800/75" />
                  <div className="h-5 animate-pulse rounded-md bg-slate-800/75" />
                  <div className="h-4 w-2/3 animate-pulse rounded-md bg-slate-800/75" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id}
                  variants={fadeUpVariants}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className="rounded-2xl"
                >
                  <FoodCard item={item} onOpen={setSelectedItem} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section variants={fadeUpVariants} className="pt-2">
          <div className="rounded-2xl border border-emerald-200/15 bg-slate-900/45 p-5 shadow-sm backdrop-blur-md">
            <h3 className="text-lg font-semibold text-amber-100">🏨 {labels.aboutOurHotel}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              Luxury rooms, fine dining, rooftop experience, and premium guest service — designed for comfort and style.
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-amber-300/90">{labels.gallery}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {GALLERY_IMAGES.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`${labels.gallery} ${index + 1}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-xl border border-emerald-200/10 object-cover"
                />
              ))}
            </div>
            <Link
              to="/hotel"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-amber-400 px-5 text-sm font-semibold text-slate-900 transition hover:brightness-110 active:scale-[0.99]"
            >
              {labels.exploreHotel}
            </Link>
          </div>
        </motion.section>
      </motion.section>
      <FoodModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </main>
  );
};

export default MenuPage;
