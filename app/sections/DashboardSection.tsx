"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { API_BASE, Card, KpiCard } from "./common";

export function DashboardSection() {
  const [stats, setStats] = useState<{
    total: number;
    activos: number;
    inactivos: number;
    mantenimientos: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const COLORS = ["#2DD4BF", "#FB7185", "#FBBF24"];

  const chartData = stats
    ? [
        { name: "Activos", value: stats.activos },
        { name: "Inactivos", value: stats.inactivos },
        { name: "Mantenimiento", value: stats.mantenimientos },
      ]
    : [];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/vehiculos/estatus`);
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error cargando stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card title="KPIs">
        <div className="grid grid-cols-2 gap-3">
          <KpiCard label="Total" value={stats?.total} loading={loading} />
          <KpiCard label="Activos" value={stats?.activos} loading={loading} />
          <KpiCard label="Inactivos" value={stats?.inactivos} loading={loading} />
          <KpiCard label="Mantenimiento" value={stats?.mantenimientos} loading={loading} />
        </div>
      </Card>

      <Card title="Estado de Unidades">
        <div className="h-72 w-full">
          {!loading && stats ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/50">Cargando gráfica...</div>
          )}
        </div>
      </Card>
    </section>
  );
}
