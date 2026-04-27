import { FormEvent, useState } from "react";
import { api } from "../api/client";
import { Match } from "../types";

export function Dashboard() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [purpose, setPurpose] = useState("atendimento_publico");
  const [matches, setMatches] = useState<Match[]>([]);
  const [queryId, setQueryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post<{ queryId: string; matches: Match[] }>("/people/search", {
        name,
        city: city || undefined,
        purpose
      });
      setMatches(data.matches);
      setQueryId(data.queryId);
    } catch {
      setError("Nao foi possivel concluir a consulta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-grid">
      <div className="panel">
        <h1>Pesquisa de pessoas</h1>
        <form className="search-form" onSubmit={handleSearch}>
          <label>
            Nome
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Joao Silva" required />
          </label>
          <label>
            Cidade
            <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Sao Paulo" />
          </label>
          <label>
            Finalidade
            <select value={purpose} onChange={(event) => setPurpose(event.target.value)}>
              <option value="atendimento_publico">Atendimento publico</option>
              <option value="validacao_cadastral">Validacao cadastral</option>
              <option value="analise_operacional">Analise operacional</option>
            </select>
          </label>
          <button disabled={loading}>{loading ? "Pesquisando..." : "Pesquisar"}</button>
        </form>
        {error && <p className="error">{error}</p>}
        {queryId && <p className="muted">Consulta auditada: {queryId}</p>}
      </div>

      <div className="results">
        {matches.map((match) => (
          <article className="result-card" key={match.id}>
            <div className="result-title">
              <div>
                <h2>{match.fullName}</h2>
                <p>{match.city}/{match.state}</p>
              </div>
              <strong>{match.confidenceScore}%</strong>
            </div>
            <dl>
              <div><dt>CPF</dt><dd>{match.documentMasked}</dd></div>
              <div><dt>E-mail</dt><dd>{match.emailMasked || "Nao informado"}</dd></div>
              <div><dt>Telefone</dt><dd>{match.phoneMasked || "Nao informado"}</dd></div>
              <div><dt>Empresa</dt><dd>{match.company}</dd></div>
              <div><dt>Cargo</dt><dd>{match.role}</dd></div>
              <div><dt>Mae</dt><dd>{match.motherName || "Nao informado"}</dd></div>
              <div><dt>Pai</dt><dd>{match.fatherName || "Nao informado"}</dd></div>
              <div><dt>Fonte</dt><dd>{match.sourceName}</dd></div>
            </dl>
          </article>
        ))}
        {!matches.length && <p className="empty">Faca uma busca para ver os resultados.</p>}
      </div>
    </section>
  );
}
