"use client";

import { Card } from "./common";

export function ConfigSection() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card title="Entorno">
        <div className="space-y-2 text-sm text-white/70">
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-xs text-white/60">API URL</p>
            <p className="mt-1 font-mono text-xs text-white/80">NEXT_PUBLIC_API_URL</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-xs text-white/60">Modo</p>
            <p className="mt-1 text-sm">Desarrollo</p>
          </div>
        </div>
      </Card>

      <Card title="Ayuda">
        <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
          <li>Conectar endpoints con fetch/axios.</li>
          <li>Usar modales para crear/editar/eliminar.</li>
          <li>Agregar toasts para feedback al usuario.</li>
          <li>Agregar paginación y ordenamiento a la tabla.</li>
        </ul>
      </Card>
    </section>
  );
}
