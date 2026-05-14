import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import MenuTable from "../components/admin/MenuTable";
import CategoryManager from "../components/admin/CategoryManager";
import HotelEditor from "../components/admin/HotelEditor";
import UploadForm from "../components/admin/UploadForm";
import ApiErrorBanner from "../components/ui/ApiErrorBanner";
import api from "../services/api";
import { describeApiError } from "../utils/apiErrors";

const emptyMenuForm = {
  name: "",
  description: "",
  price: "",
  image: null,
  category: "",
  tags: "",
  isFeatured: false,
  isAvailable: true,
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, available: 0, featured: 0 });
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hotel, setHotel] = useState({});
  const [categoryForm, setCategoryForm] = useState({ name: "", order: 0 });
  const [menuForm, setMenuForm] = useState(emptyMenuForm);
  const [editingId, setEditingId] = useState("");
  const [activeTask, setActiveTask] = useState("overview");
  const [loadError, setLoadError] = useState(null);

  const loadData = async () => {
    setLoadError(null);
    try {
      const [statsRes, itemsRes, categoriesRes, hotelRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/menu"),
        api.get("/categories"),
        api.get("/hotel"),
      ]);
      setStats(statsRes.data);
      setItems(itemsRes.data);
      setCategories(categoriesRes.data);
      setHotel(hotelRes.data);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin");
        return;
      }
      setLoadError(describeApiError(error));
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin");
      return;
    }

    const timer = setTimeout(() => {
      loadData().catch(() => {});
    }, 0);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleMenuSubmit = async (event) => {
    event.preventDefault();
    try {
      const normalizedPayload = {
        name: menuForm.name.trim(),
        description: menuForm.description.trim(),
        price: Number(menuForm.price),
        category: menuForm.category.trim(),
        tags: menuForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
          .join(","),
        isFeatured: Boolean(menuForm.isFeatured),
        isAvailable: Boolean(menuForm.isAvailable),
      };

      if (editingId) {
        if (menuForm.image) {
          const data = new FormData();
          Object.entries(normalizedPayload).forEach(([key, value]) => data.append(key, value));
          data.append("image", menuForm.image);
          await api.put(`/menu/${editingId}`, data);
        } else {
          await api.put(`/menu/${editingId}`, normalizedPayload);
        }
      } else {
        const data = new FormData();
        Object.entries(normalizedPayload).forEach(([key, value]) => data.append(key, value));
        if (menuForm.image) data.append("image", menuForm.image);
        await api.post("/menu", data);
      }

      setMenuForm(emptyMenuForm);
      setEditingId("");
      await loadData();
    } catch (error) {
      const { message, detail } = describeApiError(error);
      window.alert(detail ? `${message}\n\n${detail}` : message);
    }
  };

  const handleDeleteMenu = async (id) => {
    try {
      await api.delete(`/menu/${id}`);
      await loadData();
    } catch (error) {
      const { message, detail } = describeApiError(error);
      window.alert(detail ? `${message}\n\n${detail}` : message);
    }
  };

  const handleEditMenu = (item) => {
    setEditingId(item._id);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      image: null,
      category: item.category,
      tags: (item.tags || []).join(", "),
      isFeatured: item.isFeatured,
      isAvailable: item.isAvailable,
    });
  };

  const saveCategory = async () => {
    try {
      await api.post("/categories", categoryForm);
      setCategoryForm({ name: "", order: 0 });
      await loadData();
    } catch (error) {
      const { message, detail } = describeApiError(error);
      window.alert(detail ? `${message}\n\n${detail}` : message);
    }
  };

  const saveHotel = async () => {
    try {
      await api.put("/hotel", hotel);
      await loadData();
    } catch (error) {
      const { message, detail } = describeApiError(error);
      window.alert(detail ? `${message}\n\n${detail}` : message);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const unavailableCount = Math.max(stats.total - stats.available, 0);
  const featuredRate = stats.total ? Math.round((stats.featured / stats.total) * 100) : 0;
  const availabilityRate = stats.total ? Math.round((stats.available / stats.total) * 100) : 0;
  const sortedItems = [...items].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
  const recentItems = sortedItems.slice(0, 5);
  const topCategories = categories
    .map((category) => ({
      name: category.name,
      count: items.filter((item) => item.category === category.name).length,
    }))
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const featuredItems = items.filter((item) => item.isFeatured).slice(0, 5);

  return (
    <main className="min-h-screen bg-transparent p-4 text-slate-100">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[240px_1fr]">
        <Sidebar
          activeTask={activeTask}
          onTaskChange={(task) => {
            if (task === "image-manager") {
              navigate("/admin/image-manager");
              return;
            }
            setActiveTask(task);
          }}
          onLogout={logout}
        />
        <section className="space-y-4">
          {loadError ? (
            <ApiErrorBanner
              title="Could not load dashboard data"
              message={loadError.message}
              detail={loadError.detail}
              onDismiss={() => setLoadError(null)}
            />
          ) : null}
          {activeTask === "overview" && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Total menu items</p>
                  <p className="mt-2 text-3xl font-semibold">{stats.total}</p>
                  <p className="mt-1 text-xs text-slate-400">All dishes in your system</p>
                </article>
                <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Available now</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-300">{stats.available}</p>
                  <p className="mt-1 text-xs text-slate-400">{availabilityRate}% currently active</p>
                </article>
                <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Featured dishes</p>
                  <p className="mt-2 text-3xl font-semibold text-amber-300">{stats.featured}</p>
                  <p className="mt-1 text-xs text-slate-400">{featuredRate}% of total menu</p>
                </article>
                <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Unavailable</p>
                  <p className="mt-2 text-3xl font-semibold text-rose-300">{unavailableCount}</p>
                  <p className="mt-1 text-xs text-slate-400">Needs update or restock</p>
                </article>
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
                <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm xl:col-span-2">
                  <h3 className="text-lg font-semibold">Top Categories</h3>
                  <p className="mb-3 text-sm text-slate-400">Most populated categories in your current menu</p>
                  <div className="space-y-3">
                    {topCategories.length ? (
                      topCategories.map((category) => {
                        const percent = stats.total ? Math.round((category.count / stats.total) * 100) : 0;
                        return (
                          <div key={category.name}>
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span>{category.name}</span>
                              <span className="text-slate-400">
                                {category.count} items ({percent}%)
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-800">
                              <div
                                className="h-2 rounded-full bg-amber-400"
                                style={{ width: `${Math.max(percent, 4)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-400">No category data yet.</p>
                    )}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
                  <h3 className="text-lg font-semibold">Quick Health</h3>
                  <p className="mb-3 text-sm text-slate-400">Operational snapshot</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2">
                      <span>Categories</span>
                      <span className="font-semibold">{categories.length}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2">
                      <span>Items with images</span>
                      <span className="font-semibold">{items.filter((item) => Boolean(item.image)).length}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2">
                      <span>Featured ratio</span>
                      <span className="font-semibold">{featuredRate}%</span>
                    </div>
                  </div>
                </section>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
                  <h3 className="text-lg font-semibold">Recently Added</h3>
                  <p className="mb-3 text-sm text-slate-400">Latest menu entries</p>
                  <div className="space-y-2">
                    {recentItems.length ? (
                      recentItems.map((item) => (
                        <div key={item._id} className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2 text-sm">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-slate-400">{item.category}</p>
                          </div>
                          <span className="font-semibold text-amber-300">${item.price}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No items yet.</p>
                    )}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-sm">
                  <h3 className="text-lg font-semibold">Featured Highlights</h3>
                  <p className="mb-3 text-sm text-slate-400">Items currently promoted on the guest menu</p>
                  <div className="space-y-2">
                    {featuredItems.length ? (
                      featuredItems.map((item) => (
                        <div key={item._id} className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2 text-sm">
                          <span>{item.name}</span>
                          <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs text-amber-300">
                            {item.category}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No featured items selected yet.</p>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}

          {activeTask === "menu" && (
            <>
              <UploadForm
                form={menuForm}
                setForm={setMenuForm}
                categories={categories}
                onSubmit={handleMenuSubmit}
                editMode={Boolean(editingId)}
              />
              <MenuTable items={items} onEdit={handleEditMenu} onDelete={handleDeleteMenu} />
            </>
          )}

          {activeTask === "categories" && (
            <CategoryManager
              categories={categories}
              form={categoryForm}
              setForm={setCategoryForm}
              onSave={saveCategory}
              onDelete={async (id) => {
                try {
                  await api.delete(`/categories/${id}`);
                  await loadData();
                } catch (error) {
                  const { message, detail } = describeApiError(error);
                  window.alert(detail ? `${message}\n\n${detail}` : message);
                }
              }}
            />
          )}

          {activeTask === "hotel" && <HotelEditor hotel={hotel} setHotel={setHotel} onSave={saveHotel} />}
        </section>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
