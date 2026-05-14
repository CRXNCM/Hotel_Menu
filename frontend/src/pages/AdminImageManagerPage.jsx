import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import api from "../services/api";
import { describeApiError } from "../utils/apiErrors";
import { resolveMediaUrl } from "../utils/mediaUrl";

const makeSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const AdminImageManagerPage = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [imageMeta, setImageMeta] = useState({ width: null, height: null });

  const totalImages = images.length + processedCount;
  const currentImage = images[currentIndex] || null;

  const selectedItem = useMemo(
    () => items.find((item) => item._id === selectedItemId) || null,
    [items, selectedItemId]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, search]);

  const generatedFileName = useMemo(() => {
    if (!selectedItem || !currentImage) return "";
    const ext = currentImage.fileName.includes(".")
      ? `.${currentImage.fileName.split(".").pop().toLowerCase()}`
      : ".jpg";
    return `${makeSlug(selectedItem.name)}${ext}`;
  }, [selectedItem, currentImage]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2200);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [imagesRes, itemsRes] = await Promise.all([api.get("/image-manager/images"), api.get("/menu")]);
      setImages(imagesRes.data);
      setItems(itemsRes.data);
      setCurrentIndex(0);
      setSelectedItemId("");
      setSearch("");
      setSkipped(new Set());
    } catch (error) {
      const { message, detail } = describeApiError(error);
      showToast("error", detail ? `${message} — ${detail.replace(/\n/g, " ")}` : message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin");
      return;
    }
    loadData();
  }, [navigate]);

  useEffect(() => {
    if (!currentImage) {
      setImageMeta({ width: null, height: null });
      return;
    }

    const img = new Image();
    img.onload = () => setImageMeta({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => setImageMeta({ width: null, height: null });
    img.src = currentImage.path;
  }, [currentImage]);

  const goNext = () => {
    if (!images.length) return;
    setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));
    setSelectedItemId("");
    setSearch("");
  };

  const goPrevious = () => {
    if (!images.length) return;
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setSelectedItemId("");
    setSearch("");
  };

  const skipCurrent = () => {
    if (!currentImage) return;
    setSkipped((prev) => new Set(prev).add(currentImage.fileName));
    showToast("success", "Image skipped.");
    goNext();
  };

  const removeCurrentAndAdvance = () => {
    setImages((prev) => {
      if (!prev.length) return prev;
      const updated = prev.filter((_, index) => index !== currentIndex);
      setCurrentIndex((oldIndex) => {
        if (!updated.length) return 0;
        return Math.min(oldIndex, updated.length - 1);
      });
      return updated;
    });
    setSelectedItemId("");
    setSearch("");
    setProcessedCount((prev) => prev + 1);
  };

  const renameAndSave = async () => {
    if (!currentImage) return;
    if (!selectedItemId) {
      showToast("error", "Select a menu item first.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/image-manager/rename", {
        fileName: currentImage.fileName,
        menuItemId: selectedItemId,
      });
      showToast("success", "Image renamed and mapped.");
      removeCurrentAndAdvance();
    } catch (error) {
      const { message, detail } = describeApiError(error);
      showToast("error", detail ? `${message} (${detail.split("\n")[0]})` : message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        renameAndSave();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      } else if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        skipCurrent();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <main className="min-h-screen bg-transparent p-4 text-slate-100">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[240px_1fr]">
        <Sidebar
          activeTask="image-manager"
          onTaskChange={(task) => {
            if (task === "image-manager") navigate("/admin/image-manager");
            else navigate("/admin/dashboard");
          }}
          onLogout={() => {
            localStorage.removeItem("adminToken");
            navigate("/admin");
          }}
        />

        <section className="space-y-4">
          <header className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
            <h1 className="text-2xl font-semibold">Food Image Manager</h1>
            <p className="mt-1 text-sm text-slate-300">
              {processedCount} / {totalImages || 0} Images Processed
              {skipped.size ? ` • ${skipped.size} skipped` : ""}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-amber-400 transition-all"
                style={{ width: `${totalImages ? Math.round((processedCount / totalImages) * 100) : 0}%` }}
              />
            </div>
          </header>

          {loading ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">Loading image manager...</div>
          ) : !currentImage ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
              No pending images in `/uploads/temp/`.
            </div>
          ) : (
            <>
              <section className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
                <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
                  <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                    <img
                      src={resolveMediaUrl(currentImage.path)}
                      alt={currentImage.fileName}
                      className="h-[360px] w-full object-contain md:h-[460px]"
                    />
                  </div>
                  <div className="mt-3 text-sm text-slate-300">
                    <p>
                      <span className="text-slate-400">Current File:</span> {currentImage.fileName}
                    </p>
                    <p>
                      <span className="text-slate-400">Dimensions:</span>{" "}
                      {imageMeta.width && imageMeta.height ? `${imageMeta.width} x ${imageMeta.height}` : "Unknown"}
                    </p>
                  </div>
                </article>

                <article className="space-y-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
                  <h2 className="text-lg font-semibold">Map Image to Menu Item</h2>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search menu items..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
                  />
                  <select
                    value={selectedItemId}
                    onChange={(event) => setSelectedItemId(event.target.value)}
                    className="h-44 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
                    size={8}
                  >
                    {filteredItems.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-3">
                    <p className="text-xs uppercase tracking-wide text-amber-200">Auto Filename Preview</p>
                    <p className="mt-1 text-sm font-semibold text-amber-100">
                      {generatedFileName || "Select a menu item to generate filename"}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">Shortcuts: Enter save, Left/Right navigate, S skip.</p>
                </article>
              </section>

              <footer className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
                <button
                  type="button"
                  onClick={goPrevious}
                  className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={renameAndSave}
                  disabled={saving}
                  className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Rename & Save"}
                </button>
                <button
                  type="button"
                  onClick={skipCurrent}
                  className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm"
                >
                  Next
                </button>
              </footer>
            </>
          )}
        </section>
      </div>

      {toast && (
        <div
          className={`fixed bottom-4 right-4 rounded-xl px-4 py-3 text-sm shadow-xl ${
            toast.type === "error" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
};

export default AdminImageManagerPage;
