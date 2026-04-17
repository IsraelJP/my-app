"use client";

import { useEffect, useState } from "react";
import { getVehiculos } from "../../../services/vehiculos";

export default function BuscadorVehiculo({
    show,
    busquedaSerie,
    setBusquedaSerie,
    setShowBuscarVehiculo,
    onChangeVehiculo
}: any) {

    const [resultados, setResultados] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);

    useEffect(() => {

        if (!show) return;

        if (!busquedaSerie || busquedaSerie.length < 3) {
            setResultados([]);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                setLoading(true);

                const data = await getVehiculos({
                    query: busquedaSerie
                });

                setResultados(data?.vehiculos ?? data ?? []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delay);

    }, [busquedaSerie, show]);

    const seleccionarVehiculo = (v: any) => {

        onChangeVehiculo(v);

        setMensaje("Vehículo cambiado correctamente");

        setTimeout(() => {
            setMensaje(null);
        }, 5000);

        setBusquedaSerie("");
        setResultados([]);
        setShowBuscarVehiculo(false);
    };

    if (!show) return null;

    return (
        <div className="mb-4 space-y-2">

            <div className="text-sm text-gray-600">
                Ingresa número de serie o matrícula
            </div>

            <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Número de serie o matrícula..."
                value={busquedaSerie}
                onChange={(e) => setBusquedaSerie(e.target.value)}
            />

            {loading && (
                <p className="text-xs text-gray-500">Buscando...</p>
            )}

            {mensaje && (
                <div className="text-xs text-green-600 font-medium">
                    {mensaje}
                </div>
            )}

            {resultados.length > 0 && (
                <div className="border rounded-lg max-h-40 overflow-y-auto bg-white shadow">

                    {resultados.map((v: any) => (
                        <div
                            key={v.id_vehiculo}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => seleccionarVehiculo(v)}
                        >
                            <div className="font-medium">{v.num_serie}</div>
                            <div className="text-xs text-gray-500">
                                {v.matricula}
                            </div>
                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}