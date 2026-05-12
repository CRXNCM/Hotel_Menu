import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <main className="grid min-h-screen place-items-center bg-slate-100 p-4">
    <div className="text-center">
      <h1 className="text-3xl font-semibold">Page Not Found</h1>
      <Link to="/menu" className="mt-3 inline-block rounded-xl bg-slate-900 px-4 py-2 text-white">
        Go to Menu
      </Link>
    </div>
  </main>
);

export default NotFoundPage;
