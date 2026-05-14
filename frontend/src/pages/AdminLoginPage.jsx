import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { describeApiError } from "../utils/apiErrors";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await api.post("/login", form);
      localStorage.setItem("adminToken", response.data.token);
      navigate("/admin/dashboard");
    } catch (error) {
      if (error?.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        const { message, detail } = describeApiError(error);
        setError(detail ? `${message}\n\n${detail}` : message);
      }
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-transparent p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-3 rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-xl"
      >
        <h2 className="text-xl font-semibold">Admin Login</h2>
        {error && (
          <p className="whitespace-pre-wrap rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <input
          required
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
          value={form.username}
          onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
          placeholder="Username"
        />
        <input
          required
          type="password"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          placeholder="Password"
        />
        <button type="submit" className="w-full rounded-xl bg-amber-400 py-2 font-semibold text-slate-900">
          Sign In
        </button>
      </form>
    </main>
  );
};

export default AdminLoginPage;
