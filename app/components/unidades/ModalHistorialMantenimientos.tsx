"use client";

import { useEffect, useState } from "react";

import HeaderVehiculo from "./mantenimiento/HeaderVehiculo";
import ToolbarAcciones from "./mantenimiento/ToolbarAcciones";
import BuscadorVehiculo from "./mantenimiento/BuscadorVehiculo";
import FiltrosMantenimientos from "./mantenimiento/FiltrosMantenimientos";
import TablaMantenimientos from "./mantenimiento/TablaMantenimientos";
import Paginacion from "./mantenimiento/Paginacion";
import { getHistorialMantenimientos } from "../../services/mantenimientos";

import { getTiposMantenimiento } from "../../services/tiposMantenimiento";

export default function ModalHistorialMantenimientos({
    vehiculo,
    open,
    onClose,
    onChangeVehiculo,
    fetchHistorial
}: any) {

    const [mantenimientos, setMantenimientos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mensajeCambioVehiculo, setMensajeCambioVehiculo] = useState("");

    const [tiposMantenimiento, setTiposMantenimiento] = useState<any[]>([]);

    const [showBuscarVehiculo, setShowBuscarVehiculo] = useState(false);
    const [busquedaSerie, setBusquedaSerie] = useState("");

    const [showFilters, setShowFilters] = useState(false);

    const [offset, setOffset] = useState(0);
    const limit = 5;

    const toggleFilters = () => {
        setShowFilters(prev => !prev);
        setShowBuscarVehiculo(false);
    };

    const [filtros, setFiltros] = useState({
        folio: "",
        id_tipo_mantenimiento: "",
        fecha_ingreso: "",
        fecha_egreso: "",
        fecha_inicio: "",
        fecha_termino: "",
        estado: "",
        orden: "desc"
    });

    useEffect(() => {
        const loadTipos = async () => {
            try {
                const data = await getTiposMantenimiento();
                setTiposMantenimiento(data);
            } catch (err) {
                console.error(err);
            }
        };

        loadTipos();
    }, []);

    useEffect(() => {
        if (!vehiculo?.num_serie || !open) return;

        const load = async () => {
            setLoading(true);

            try {
                const data = await getHistorialMantenimientos(
                    vehiculo.num_serie,
                    filtros,
                    offset,
                    limit
                );

                setMantenimientos(data?.mantenimientos ?? []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [vehiculo?.num_serie, open, filtros, offset]);

    useEffect(() => {
        if (!vehiculo?.num_serie) return;

        setOffset(0);

        setFiltros({
            folio: "",
            id_tipo_mantenimiento: "",
            fecha_ingreso: "",
            fecha_egreso: "",
            fecha_inicio: "",
            fecha_termino: "",
            estado: "",
            orden: "desc"
        });
    }, [vehiculo?.num_serie]);

    const abrirFiltros = () => {
        setShowFilters(true);
        setShowBuscarVehiculo(false);
    };

    const abrirBuscadorVehiculo = () => {
        setShowBuscarVehiculo(true);
        setShowFilters(false);
    };

    if (!open) return null;

    const limpiarFiltros = () => {
        setFiltros({
            folio: "",
            id_tipo_mantenimiento: "",
            fecha_ingreso: "",
            fecha_egreso: "",
            fecha_inicio: "",
            fecha_termino: "",
            estado: "",
            orden: "desc"
        });
        setOffset(0);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">

                <HeaderVehiculo vehiculo={vehiculo} onClose={onClose} />

                {mensajeCambioVehiculo && (
                    <div className="mb-3 text-green-600 text-sm font-medium">
                        {mensajeCambioVehiculo}
                    </div>
                )}

                <ToolbarAcciones
                    setShowBuscarVehiculo={setShowBuscarVehiculo}
                    showFilters={showFilters}
                    setShowFilters={toggleFilters}
                    limpiarFiltros={limpiarFiltros}
                />

                {showBuscarVehiculo && !showFilters && (
                    <BuscadorVehiculo
                        show={showBuscarVehiculo}
                        busquedaSerie={busquedaSerie}
                        setBusquedaSerie={setBusquedaSerie}
                        setShowBuscarVehiculo={setShowBuscarVehiculo}
                        onChangeVehiculo={(v: any) => {
                            onChangeVehiculo(v);

                            setMensajeCambioVehiculo("Vehículo cambiado correctamente");

                            setTimeout(() => {
                                setMensajeCambioVehiculo("");
                            }, 5000);

                            setShowBuscarVehiculo(false);
                            setOffset(0);
                        }}
                    />
                )}

                {showFilters && !showBuscarVehiculo && (
                    <FiltrosMantenimientos
                        show={showFilters}
                        filtros={filtros}
                        setFiltros={setFiltros}
                        tiposMantenimiento={tiposMantenimiento}
                    />
                )}

                <TablaMantenimientos
                    loading={loading}
                    mantenimientos={mantenimientos}
                />

                <Paginacion
                    offset={offset}
                    setOffset={setOffset}
                    limit={limit}
                    mantenimientos={mantenimientos}
                />

            </div>
        </div>
    );
}