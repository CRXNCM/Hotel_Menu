import { Link } from "react-router-dom";

const taskItems = [
  { id: "overview", label: "Dashboard Overview", icon: "📊" },
  { id: "menu", label: "Menu Management", icon: "🍽️" },
  { id: "categories", label: "Category Management", icon: "🗂️" },
  { id: "hotel", label: "Hotel Info Management", icon: "🏨" },
  { id: "image-manager", label: "Food Image Manager", icon: "🖼️" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

const Sidebar = ({ activeTask, onTaskChange, onLogout }) => (
  <aside className="space-y-4 rounded-3xl border border-slate-700/70 bg-slate-950/80 p-5 text-slate-100 shadow-2xl backdrop-blur">
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-400">Control Center</p>
      <h2 className="text-xl font-semibold">Admin Panel</h2>
    </div>
    <div className="space-y-2">
      {taskItems.map((task) => (
        <button
          key={task.id}
          type="button"
          onClick={() => onTaskChange(task.id)}
          className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
            activeTask === task.id
              ? "bg-amber-400 font-semibold text-slate-900"
              : "border border-slate-700 bg-slate-900/70 text-slate-200 hover:border-slate-500"
          }`}
        >
          <span>{task.icon}</span>
          {task.label}
        </button>
      ))}
    </div>
    <Link
      className="block rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-center text-slate-200 transition hover:border-slate-400"
      to="/menu"
      target="_blank"
    >
      Live Preview
    </Link>
    <button
      type="button"
      onClick={onLogout}
      className="w-full rounded-xl bg-rose-500 px-3 py-2 font-semibold text-white transition hover:bg-rose-400"
    >
      Logout
    </button>
  </aside>
);

export default Sidebar;
