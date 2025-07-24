"use client";

import { useRouter } from "next/navigation";
import FormClienteCompleto from "@/components/clienti/FormClienteCompleto";
import { Cliente } from "@/types/clienti/cliente";
import { creaCliente } from "@/lib/clienti/api";

export default function NuovoCliente() {
  const router = useRouter();

  const handleSave = (data: Cliente) => {
    // Logica di salvataggio al backend (usa fetch come prima)
    creaCliente(data).then(() => {
      router.push("/clienti");
    });
  };

  const handleClose = () => {
    router.push("/clienti");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nuovo Cliente</h1>
      <FormClienteCompleto
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        clienteEdit={undefined}
      />
    </div>
  );
}
