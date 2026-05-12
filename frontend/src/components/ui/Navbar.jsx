import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import hotelLogo from "../../assets/logo black.png";

const Navbar = ({ language, onLanguageChange, labels }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const links = useMemo(
    () => [
      { to: "/menu", label: labels.menu },
      { to: "/hotel", label: labels.hotelInfo },
    ],
    [labels]
  );

  return (
    <>
      <header className="sticky top-0 z-50 h-[70px] border-b border-emerald-200/10 bg-slate-950/55 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between px-4 text-white sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-200/15 bg-black/25 transition hover:border-emerald-200/35 active:scale-95"
          >
            ☰
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
            <img src={hotelLogo} alt="Hotel logo" className="h-9 w-9 rounded-full border border-emerald-200/20 object-cover" />
            <span className="truncate text-sm font-semibold tracking-wide text-amber-50 sm:text-base">
              {labels.hotelName}
            </span>
          </div>

          <Link
            to="/hotel"
            aria-label={labels.hotelInfo}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-200/15 bg-black/25 transition hover:border-emerald-200/35 active:scale-95"
          >
            🏨
          </Link>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close menu overlay"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/55"
            />
            <motion.aside
              className="absolute left-0 top-0 h-full w-[86%] max-w-sm border-r border-emerald-200/10 bg-slate-950/70 p-4 text-white backdrop-blur-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs uppercase tracking-wider text-amber-300">{labels.smartDining}</p>
                  <p className="text-base font-semibold text-amber-50">{labels.hotelName}</p>
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-200/15 bg-black/25 transition hover:border-emerald-200/35 active:scale-95"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-emerald-200/10 bg-black/20 p-3">
                  <label className="block text-xs font-medium text-slate-200">{labels.language}</label>
                  <select
                    aria-label={labels.language}
                    value={language}
                    onChange={(event) => onLanguageChange(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-emerald-200/15 bg-slate-950/60 px-3 py-3 text-sm outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
                  >
                    <option value="en">English</option>
                    <option value="am">Amharic</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>

                <nav className="space-y-2">
                  {links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition active:scale-[0.99] ${
                        location.pathname === link.to
                          ? "border-amber-300/40 bg-amber-300/15 text-amber-50"
                          : "border-emerald-200/10 bg-black/20 text-slate-100 hover:border-emerald-200/25"
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-slate-300">›</span>
                    </Link>
                  ))}
                  <a
                    href="#menu-content"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-emerald-200/10 bg-black/20 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-emerald-200/25 active:scale-[0.99]"
                  >
                    <span>{labels.explore}</span>
                    <span className="text-slate-300">↓</span>
                  </a>
                </nav>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
