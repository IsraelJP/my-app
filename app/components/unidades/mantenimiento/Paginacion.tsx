"use client";

export default function Paginacion({
  offset,
  setOffset,
  limit,
  mantenimientos
}: any) {
  return (
    <div className="flex justify-center gap-3 mt-5">

      <button
        className="px-3 py-1 border rounded-lg disabled:opacity-50"
        disabled={offset === 0}
        onClick={() => setOffset(offset - limit)}
      >
        Anterior
      </button>

      <button
        className="px-3 py-1 border rounded-lg disabled:opacity-50"
        disabled={mantenimientos.length < limit}
        onClick={() => setOffset(offset + limit)}
      >
        Siguiente
      </button>

    </div>
  );
}