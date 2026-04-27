import { Link, Outlet, useNavigate } from "react-router-dom";
import { getStoredUser, logout } from "../auth";

export function Layout() {
  const navigate = useNavigate();
  const user = getStoredUser();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <strong>Consulta Segura</strong>
          <span>{user?.agencyName}</span>
        </div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/audit">Auditoria</Link>
          <button onClick={handleLogout}>Sair</button>
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
