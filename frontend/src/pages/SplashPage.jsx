import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hotelLogo from "../assets/logo black.png";

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const id = setTimeout(() => navigate("/menu", { replace: true }), 900);
    return () => clearTimeout(id);
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-slate-950 to-emerald-950/70 px-6 text-slate-100">
      <div className="w-full max-w-sm space-y-5 text-center">
        <img
          src={hotelLogo}
          alt="Just Hotel"
          className="mx-auto h-24 w-24 rounded-full border border-emerald-200/20 object-cover shadow-2xl shadow-black/60"
        />
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-amber-300">Just Hotel</p>
          <h1 className="text-2xl font-semibold text-amber-50">Luxury Menu</h1>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-amber-300/60 to-emerald-300/60" />
        </div>
        <p className="text-sm text-slate-300">Loading your dining experience…</p>
      </div>
    </main>
  );
};

export default SplashPage;
