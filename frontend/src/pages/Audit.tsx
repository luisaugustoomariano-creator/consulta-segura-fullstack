import { useEffect, useState } from "react";
import { api } from "../api/client";
import { getStoredUser } from "../auth";
import { AuditSearch } from "../types";

export function Audit() {
  const user = getStoredUser();
  const allowed = user?.role === "ADMIN" || user?.role === "AUDITOR";
  const [searches, setSearches] = useState<AuditSearch[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!allowed) return;

    api
      .get<AuditSearch[]>("/audit/searches")
      .then(({ data }) => setSearches(data))
      .catch(() => setError("Nao foi possivel carregar a auditoria."));
  }, [allowed]);

  if (!allowed) {
    return (
      <section className="panel">
        <h1>Auditoria</h1>
        <p className="error">Acesso negado.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h1>Auditoria de consultas</h1>
      {error && <p className="error">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Query</th>
              <th>Finalidade</th>
              <th>Resultados</th>
              <th>IP</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {searches.map((search) => (
              <tr key={search.id}>
                <td>{search.user.name}<br /><span>{search.user.email}</span></td>
                <td>{search.query}</td>
                <td>{search.purpose}</td>
                <td>{search.resultCount}</td>
                <td>{search.ipAddress || "-"}</td>
                <td>{new Date(search.createdAt).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
