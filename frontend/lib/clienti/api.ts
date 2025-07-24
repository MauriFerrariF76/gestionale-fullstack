import { Cliente } from "../../types/clienti/cliente";
import { apiFetch } from "../api";

export async function getClienti(page = 1, pageSize = 20): Promise<Cliente[]> {
  return apiFetch<Cliente[]>(`/clienti?page=${page}&pageSize=${pageSize}`);
}

export async function creaCliente(cliente: Cliente): Promise<Cliente> {
  try {
    return await apiFetch<Cliente>(`/clienti`, {
      method: "POST",
      body: JSON.stringify(cliente),
    });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as { response?: unknown }).response === "object" &&
      (err as { response?: unknown }).response !== undefined &&
      (err as { response?: { status?: number } }).response !== null &&
      "status" in (err as { response?: { status?: number } }).response! &&
      (err as { response?: { status?: number } }).response!.status === 409
    ) {
      throw new Error("ID Cliente già esistente");
    }
    throw err;
  }
}

export async function modificaCliente(
  id: string,
  cliente: Cliente
): Promise<Cliente> {
  return apiFetch<Cliente>(`/clienti/${id}`, {
    method: "PUT",
    body: JSON.stringify(cliente),
  });
}

export async function eliminaCliente(id: string): Promise<void> {
  await apiFetch(`/clienti/${id}`, {
    method: "DELETE",
  });
}

export async function checkIdClienteUnivoco(id: string): Promise<boolean> {
  const res = await apiFetch<{ exists: boolean }>(
    `/clienti?id=${encodeURIComponent(id)}`
  );
  return res.exists;
}

export async function getMaxIdCliente(): Promise<string | null> {
  const res = await fetch("http://localhost:3001/api/clienti/max-id");
  if (!res.ok) throw new Error("Errore nel recupero del massimo IdCliente");
  const data = await res.json();
  return data.maxIdCliente ?? null;
}
