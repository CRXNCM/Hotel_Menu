const HotelEditor = ({ hotel, setHotel, onSave }) => (
  <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
    <h3 className="mb-2 font-semibold">Hotel Information</h3>
    <div className="grid gap-2 sm:grid-cols-2">
      <textarea
        className="min-h-[88px] rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 sm:col-span-2"
        value={hotel.about || ""}
        onChange={(event) => setHotel((prev) => ({ ...prev, about: event.target.value }))}
        placeholder="about"
      />
      <textarea
        className="min-h-[72px] rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 sm:col-span-2"
        value={hotel.address || ""}
        onChange={(event) => setHotel((prev) => ({ ...prev, address: event.target.value }))}
        placeholder="address (landmark, plus code, city)"
      />
      {["phone", "whatsapp", "location", "checkIn", "checkOut", "emergencyContact"].map((field) => (
        <input
          key={field}
          className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
          value={hotel[field] || ""}
          onChange={(event) => setHotel((prev) => ({ ...prev, [field]: event.target.value }))}
          placeholder={field}
        />
      ))}
      <input
        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 sm:col-span-2"
        value={(hotel.facilities || []).join(", ")}
        onChange={(event) =>
          setHotel((prev) => ({
            ...prev,
            facilities: event.target.value.split(",").map((item) => item.trim()).filter(Boolean),
          }))
        }
        placeholder="Facilities (comma separated)"
      />
      <button
        type="button"
        onClick={onSave}
        className="rounded-xl bg-amber-400 px-3 py-2 font-semibold text-slate-900 sm:col-span-2"
      >
        Save Hotel Info
      </button>
    </div>
  </section>
);

export default HotelEditor;
