import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import api from "../services/api";
import { getText } from "../utils/i18n";

const HotelPage = () => {
  const [info, setInfo] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem("guest-language") || "en");

  useEffect(() => {
    localStorage.setItem("guest-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    api.get("/hotel").then((response) => setInfo(response.data));
  }, []);

  const labels = {
    smartDining: getText(language, "smartDining"),
    hotelName: getText(language, "hotelName"),
    menu: getText(language, "menu"),
    hotelInfo: getText(language, "hotelInfo"),
    explore: getText(language, "explore"),
    language: getText(language, "language"),
    hotelInfoTitle: getText(language, "hotelInfoTitle"),
    aboutOurHotel: getText(language, "aboutOurHotel"),
    facilities: getText(language, "facilities"),
    gallery: getText(language, "gallery"),
    contact: getText(language, "contact"),
    location: getText(language, "location"),
    footerNote: getText(language, "footerNote"),
  };

  const facilities =
    info?.facilities?.length
      ? info.facilities
      : ["WiFi", "Gym", "Parking", "Pool", "Dining", "Spa"];

  const facilityIcon = (name) => {
    const key = String(name || "").toLowerCase();
    if (key.includes("wifi")) return "📶";
    if (key.includes("gym")) return "🏋️";
    if (key.includes("park")) return "🚗";
    if (key.includes("pool")) return "🏊";
    if (key.includes("dining") || key.includes("restaurant")) return "🍽️";
    if (key.includes("spa")) return "💆";
    return "✨";
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-emerald-950/70 text-slate-100">
      <Navbar language={language} onLanguageChange={setLanguage} labels={labels} />
      <section className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
        <section className="relative overflow-hidden rounded-3xl border border-emerald-200/10 bg-[url('https://images.unsplash.com/photo-1551887373-6fd1d6b8bca8?w=1600')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          <div className="relative p-6 sm:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-amber-300">{labels.hotelInfoTitle}</p>
            <h2 className="mt-2 text-3xl font-semibold text-amber-50 sm:text-4xl">{labels.hotelName}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
              {info?.about || "Luxury rooms, fine dining, and rooftop moments — curated for a premium guest stay."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/menu"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-emerald-200/20 bg-black/25 px-5 text-sm font-semibold text-slate-100 backdrop-blur-md transition hover:border-emerald-200/35 active:scale-[0.99]"
              >
                ← {labels.menu}
              </Link>
              {info?.location && (
                <a
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-amber-400 px-5 text-sm font-semibold text-slate-900 transition hover:brightness-110 active:scale-[0.99]"
                  href={info.location}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Maps
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-200/15 bg-slate-900/45 p-5 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-amber-100">{labels.aboutOurHotel}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            {info?.about ||
              "Luxury rooms, fine dining, rooftop experience, and premium guest service — designed for comfort and style."}
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200/15 bg-slate-900/45 p-5 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-amber-100">🛎️ {labels.facilities}</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {facilities.slice(0, 6).map((facility) => (
              <div
                key={facility}
                className="flex items-center gap-3 rounded-2xl border border-emerald-200/10 bg-black/20 px-4 py-4 transition hover:border-emerald-200/25"
              >
                <span className="text-xl">{facilityIcon(facility)}</span>
                <span className="text-sm font-medium text-slate-100">{facility}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-200/15 bg-slate-900/45 p-5 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-amber-100">{labels.gallery}</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200",
              "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200",
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
              "https://images.unsplash.com/photo-1551887373-6fd1d6b8bca8?w=1200",
            ].map((src) => (
              <img
                key={src}
                src={src}
                alt="Hotel gallery"
                loading="lazy"
                className="h-32 w-full rounded-2xl border border-emerald-200/10 object-cover sm:h-40"
              />
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-emerald-200/15 bg-slate-900/45 p-5 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-amber-100">{labels.contact}</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-200">
              <p>
                <span className="text-slate-400">Phone:</span> {info?.phone || "N/A"}
              </p>
              <p>
                <span className="text-slate-400">WhatsApp:</span> {info?.whatsapp || "N/A"}
              </p>
              <p>
                <span className="text-slate-400">Emergency:</span> {info?.emergencyContact || "N/A"}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-200/15 bg-slate-900/45 p-5 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-amber-100">{labels.location}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">
              {info?.address || "Open the map for directions to the hotel location."}
            </p>
            <div className="mt-4">
              <a
                className="inline-flex h-11 items-center justify-center rounded-xl border border-emerald-200/20 bg-black/25 px-5 text-sm font-semibold text-slate-100 backdrop-blur-md transition hover:border-emerald-200/35 active:scale-[0.99]"
                href={info?.location || "#"}
                target="_blank"
                rel="noreferrer"
              >
                Open Google Maps
              </a>
            </div>
          </section>
        </section>

        <footer className="pb-3 pt-2 text-center text-xs text-slate-400">
          {labels.footerNote}
        </footer>
      </section>
    </main>
  );
};

export default HotelPage;
