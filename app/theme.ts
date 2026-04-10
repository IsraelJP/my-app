// =============================================================
// PALETA DE COLORES — edita aquí para cambiar el aspecto global
// =============================================================

/** Colores hex para gráficas (Recharts no acepta clases de Tailwind) */
export const CHART_COLORS = ["#6366F1", "#F43F5E", "#F59E0B"] as const;

/**
 * Clases de Tailwind agrupadas por función.
 * Usar estas constantes en los componentes en lugar de clases sueltas.
 */
export const THEME = {
  // ── Fondos ────────────────────────────────────────────────
  page:    "bg-gradient-to-br from-slate-100 to-slate-50",
  surface: "bg-white border border-slate-200",
  inset:   "bg-slate-50 border border-slate-100",
  overlay: "bg-black/30 backdrop-blur-sm",

  // ── Tipografía ────────────────────────────────────────────
  heading: "text-slate-800",
  body:    "text-slate-600",
  muted:   "text-slate-400",
  label:   "text-xs text-slate-500",
  mono:    "font-mono text-xs text-slate-500",

  // ── Inputs ────────────────────────────────────────────────
  input:  "border border-slate-200 bg-white text-slate-800 rounded-xl px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-300",
  select: "border border-slate-200 bg-white text-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300",

  // ── Botones ───────────────────────────────────────────────
  btnPrimary:   "bg-indigo-500 text-white hover:bg-indigo-600 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50",
  btnSecondary: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
  btnDanger:    "bg-rose-500 text-white hover:bg-rose-600 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50",
  btnGhost:     "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
  btnEdit:      "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200 hover:bg-indigo-100 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
  btnDelete:    "bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
  btnSuccess:   "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
  btnMantenimiento: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",

  // ── Tabla ─────────────────────────────────────────────────
  tableWrapper: "overflow-hidden rounded-2xl border border-slate-200",
  table:        "w-full border-collapse bg-white text-left text-sm",
  thead:        "bg-slate-50 text-xs uppercase tracking-wide text-slate-500",
  trow:         "border-t border-slate-100 hover:bg-slate-50 transition-colors",
  tcell:        "px-4 py-3 text-slate-700",
  tcellMono:    "px-4 py-3 font-mono text-xs text-slate-500",
  th:           "px-4 py-3",

  // ── Navegación lateral ────────────────────────────────────
  navActive:   "bg-indigo-50 text-indigo-700 font-semibold",
  navInactive: "text-slate-600 hover:bg-slate-100",

  // ── Badges de estatus ─────────────────────────────────────
  badgeActivo:          "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  badgeMantenimiento:   "bg-amber-50   text-amber-700   ring-1 ring-amber-200",
  badgeInactivo:        "bg-rose-50    text-rose-600    ring-1 ring-rose-200",
  badgeEnMantenimiento: "bg-amber-50   text-amber-700   ring-1 ring-amber-200",
  badgeFinalizado:      "bg-sky-50     text-sky-700     ring-1 ring-sky-200",

  // ── Alertas y toasts ──────────────────────────────────────
  errorBox: "border border-rose-200 bg-rose-50 text-rose-600 rounded-xl px-4 py-2 text-sm",
  toastOk:  "bg-white text-emerald-700 ring-1 ring-emerald-200 shadow-xl rounded-2xl px-5 py-3 text-sm font-semibold",
  toastErr: "bg-white text-rose-600   ring-1 ring-rose-200   shadow-xl rounded-2xl px-5 py-3 text-sm font-semibold",

  // ── Logo / acento del sidebar ─────────────────────────────
  logo: "bg-indigo-100 text-indigo-600",

  // ── KPI cards ─────────────────────────────────────────────
  kpiCard:     "rounded-xl border border-slate-200 bg-slate-50 p-3",
  kpiLabel:    "text-xs text-slate-500",
  kpiValue:    "mt-2 text-2xl font-bold text-slate-800",
  kpiSkeleton: "h-7 w-16 animate-pulse rounded-lg bg-slate-200",

  // ── Skeleton loading ──────────────────────────────────────
  skeleton: "h-10 animate-pulse rounded-xl bg-slate-100",
} as const;
