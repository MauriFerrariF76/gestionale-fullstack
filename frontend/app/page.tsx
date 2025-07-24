"use client";

import AppLayout from "@/components/AppLayout";
import Link from "next/link";
// import ClientiPage from "./clienti/page"; // RIMOSSO perché non usato

export default function Home() {
  // Poi SOSTITUISCI le tue headerActions esistenti con:
  const headerActions = <></>;
  // const ExampleButtons = () => ( // RIMOSSO perché non usato
  //   <div className="flex gap-3 flex-wrap">
  //     <Button variant="primary">Primary</Button>
  //     <Button variant="secondary">Secondary</Button>
  //     <Button variant="success">Success</Button>
  //     <Button variant="danger">Danger</Button>
  //     <Button variant="ghost">Ghost</Button>
  //     <Button variant="outline">Outline</Button>

  //     {/* Con icone */}
  //     <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
  //       Con Icona
  //     </Button>

  //     {/* Loading state */}
  //     <Button variant="primary" isLoading>
  //       Loading...
  //     </Button>

  //     {/* Diverse dimensioni */}
  //     <Button variant="primary" size="sm">
  //       Small
  //     </Button>
  //     <Button variant="primary" size="md">
  //       Medium
  //     </Button>
  //     <Button variant="primary" size="lg">
  //       Large
  //     </Button>
  //   </div>
  // );

  return (
    <AppLayout
      pageTitle="Dashboard"
      pageDescription="Panoramica generale sistema"
      headerActions={headerActions}
    >
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-6 hover:bg-neutral-700/80 transition-all">
          <div className="text-2xl font-light text-neutral-100 mb-1">24</div>
          <div className="text-sm text-neutral-400">Commesse Attive</div>
          <div className="text-xs text-neutral-500 mt-2">
            +12% vs mese scorso
          </div>
        </div>

        <div className="bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-6 hover:bg-neutral-700/80 transition-all">
          <div className="text-2xl font-light text-amber-400 mb-1">7</div>
          <div className="text-sm text-neutral-400">In Scadenza</div>
          <div className="text-xs text-amber-400/70 mt-2">
            Attenzione richiesta
          </div>
        </div>

        <div className="bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-6 hover:bg-neutral-700/80 transition-all">
          <div className="text-2xl font-light text-neutral-100 mb-1">13</div>
          <div className="text-sm text-neutral-400">Dipendenti Attivi</div>
          <div className="text-xs text-neutral-500 mt-2">Tutti operativi</div>
        </div>

        <div className="bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-6 hover:bg-neutral-700/80 transition-all">
          <div className="text-2xl font-light text-[#3B82F6] mb-1">€45.2K</div>
          <div className="text-sm text-neutral-400">Fatturato Luglio</div>
          <div className="text-xs text-[#3B82F6]/70 mt-2">+8% vs obiettivo</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-700/40 border border-neutral-600/40 rounded-lg p-6">
          <h3 className="text-lg font-medium text-neutral-200 mb-4">
            Andamento Commesse
          </h3>
          <div className="h-48 bg-neutral-800/30 rounded-lg flex items-center justify-center border border-neutral-700/30">
            <div className="text-neutral-500 text-center">
              <div className="text-sm">Grafico commesse mensili</div>
              <div className="text-xs mt-1">(In sviluppo)</div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-700/40 border border-neutral-600/40 rounded-lg p-6">
          <h3 className="text-lg font-medium text-neutral-200 mb-4">
            Produttività Settimanale
          </h3>
          <div className="h-48 bg-neutral-800/30 rounded-lg flex items-center justify-center border border-neutral-700/30">
            <div className="text-neutral-500 text-center">
              <div className="text-sm">Ore lavorate vs stimate</div>
              <div className="text-xs mt-1">(In sviluppo)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-700/40 border border-neutral-600/40 rounded-lg p-6">
        <h3 className="text-lg font-medium text-neutral-200 mb-4">
          Azioni Rapide
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/commesse"
            className="bg-neutral-700/50 hover:bg-neutral-700/70 border border-neutral-600/50 rounded-lg p-4 text-center transition-all duration-200 hover:scale-[0.98] active:scale-[0.96] block"
          >
            <div className="text-sm text-neutral-300">Nuova Commessa</div>
          </Link>

          <Link
            href="/commesse"
            className="bg-neutral-700/50 hover:bg-neutral-700/70 border border-neutral-600/50 rounded-lg p-4 text-center transition-all duration-200 hover:scale-[0.98] active:scale-[0.96] block"
          >
            <div className="text-sm text-neutral-300">Lista Commesse</div>
          </Link>

          <Link
            href="/dipendenti"
            className="bg-neutral-700/50 hover:bg-neutral-700/70 border border-neutral-600/50 rounded-lg p-4 text-center transition-all duration-200 hover:scale-[0.98] active:scale-[0.96] block"
          >
            <div className="text-sm text-neutral-300">Gestione Dipendenti</div>
          </Link>

          <Link
            href="/documenti"
            className="bg-neutral-700/50 hover:bg-neutral-700/70 border border-neutral-600/50 rounded-lg p-4 text-center transition-all duration-200 hover:scale-[0.98] active:scale-[0.96] block"
          >
            <div className="text-sm text-neutral-300">Carica PDF</div>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
