const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "API base URL non definita. Controlla la variabile NEXT_PUBLIC_API_BASE_URL nel file .env.local"
    );
  }
  // Assicuro che endpoint sia una stringa valida e inizi con uno slash
  if (!endpoint || typeof endpoint !== "string") {
    throw new Error("Endpoint API non valido");
  }
  const url = `${API_URL}${
    endpoint.startsWith("/") ? endpoint : "/" + endpoint
  }`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Errore API");
  }
  return res.json();
}
