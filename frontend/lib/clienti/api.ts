import { Cliente } from "../../types/clienti/cliente";
import { apiFetch } from "../api";

export async function getClienti(page = 1, pageSize = 20): Promise<Cliente[]> {
  const response = await apiFetch<{ success: boolean; data: Cliente[]; pagination: any }>(`/clienti?page=${page}&pageSize=${pageSize}`);
  return response.data;
}

export async function creaCliente(cliente: Cliente): Promise<Cliente> {
  try {
    const response = await apiFetch<{ success: boolean; message: string; data: Cliente }>(`/clienti`, {
      method: "POST",
      body: JSON.stringify(cliente),
    });
    return response.data;
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
  const response = await apiFetch<{ success: boolean; message: string; data: Cliente }>(`/clienti/${id}`, {
    method: "PUT",
    body: JSON.stringify(cliente),
  });
  return response.data;
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
  const response = await apiFetch<{ success: boolean; data: { maxIdCliente: string } }>('/clienti/max-id');
  return response.data.maxIdCliente ?? null;
}
