"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Solicitud = {
    id: number;
    mascota_id: number;
    adoptante_id: string;
    mensaje: string;
    estado: string;
    created_at: string;
};

type Mascota = {
    id: number;
    nombre: string;
    tipo: string;
    edad: string;
    imagen: string | null;
};

export default function SolicitudesPage() {
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [mascotas, setMascotas] = useState<Mascota[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [actualizando, setActualizando] = useState<number | null>(null);

    async function cargarSolicitudes() {
        setCargando(true);
        setError("");

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setError("No hay una sesión iniciada.");
            setCargando(false);
            return;
        }

        const { data: solicitudesData, error: errorSolicitudes } =
            await supabase
                .from("solicitudes_adopcion")
                .select("*")
                .order("created_at", { ascending: false });

        if (errorSolicitudes) {
            console.error(errorSolicitudes);
            setError("No se pudieron cargar las solicitudes.");
            setCargando(false);
            return;
        }

        setSolicitudes(solicitudesData ?? []);

        const idsMascotas = (solicitudesData ?? []).map(
            (solicitud) => solicitud.mascota_id
        );

        if (idsMascotas.length > 0) {
            const { data: mascotasData, error: errorMascotas } =
                await supabase
                    .from("mascotas")
                    .select("id, nombre, tipo, edad, imagen")
                    .in("id", idsMascotas);

            if (errorMascotas) {
                console.error(errorMascotas);
                setError("No se pudieron cargar las mascotas.");
                setCargando(false);
                return;
            }

            setMascotas(mascotasData ?? []);
        } else {
            setMascotas([]);
        }

        setCargando(false);
    }

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    function obtenerMascota(id: number) {
        return mascotas.find((mascota) => mascota.id === id);
    }

    async function cambiarEstado(
        solicitud: Solicitud,
        nuevoEstado: string
    ) {
        setActualizando(solicitud.id);
        setError("");

        const { error: errorSolicitud } = await supabase
            .from("solicitudes_adopcion")
            .update({ estado: nuevoEstado })
            .eq("id", solicitud.id);

        if (errorSolicitud) {
            console.error(errorSolicitud);
            setError("No se pudo actualizar la solicitud.");
            setActualizando(null);
            return;
        }

        // Si se aprueba la solicitud, la mascota pasa a Adoptada.
        if (nuevoEstado === "Aprobada") {
            const { error: errorMascota } = await supabase
                .from("mascotas")
                .update({ estado: "Adoptada" })
                .eq("id", solicitud.mascota_id);

            if (errorMascota) {
                console.error(errorMascota);
                setError(
                    "La solicitud fue aprobada, pero no se pudo actualizar el estado de la mascota."
                );
                setActualizando(null);
                return;
            }
        }

        // Si se rechaza una solicitud, NO modificamos
        // el estado de la mascota.

        await cargarSolicitudes();
        setActualizando(null);
    }

    async function eliminarSolicitud(solicitud: Solicitud) {
        if (solicitud.estado !== "Rechazada") {
            return;
        }

        setActualizando(solicitud.id);
        setError("");

        const { error } = await supabase
            .from("solicitudes_adopcion")
            .delete()
            .eq("id", solicitud.id);

        if (error) {
            console.error(error);
            setError("No se pudo eliminar la solicitud.");
            setActualizando(null);
            return;
        }

        await cargarSolicitudes();
        setActualizando(null);
    }

    return (
        <main className="min-h-screen bg-orange-50 px-6 py-12">
            <div className="mx-auto max-w-6xl">
                <div className="rounded-2xl bg-white p-8 shadow-md">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                Solicitudes de adopción
                            </h1>

                            <p className="mt-2 text-gray-600">
                                Revisa y gestiona las solicitudes recibidas.
                            </p>
                        </div>

                        <a
                            href="/dashboard"
                            className="w-fit rounded-full border-2 border-orange-500 px-5 py-2 font-semibold text-orange-600 transition hover:bg-orange-50"
                        >
                            ← Volver
                        </a>
                    </div>

                    {cargando ? (
                        <p className="mt-8 text-gray-600">
                            Cargando solicitudes...
                        </p>
                    ) : error ? (
                        <p className="mt-8 rounded-lg bg-red-50 p-4 text-red-600">
                            {error}
                        </p>
                    ) : solicitudes.length === 0 ? (
                        <div className="mt-8 rounded-2xl bg-orange-50 p-8 text-center">
                            <p className="text-lg font-semibold text-gray-700">
                                No hay solicitudes de adopción.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                            {solicitudes.map((solicitud) => {
                                const mascota = obtenerMascota(
                                    solicitud.mascota_id
                                );

                                return (
                                    <div
                                        key={solicitud.id}
                                        className="overflow-hidden rounded-2xl border border-orange-100 bg-orange-50"
                                    >
                                        {mascota?.imagen && (
                                            <div className="h-56 overflow-hidden">
                                                <img
                                                    src={mascota.imagen}
                                                    alt={`Foto de ${mascota.nombre}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        )}

                                        <div className="p-6">
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {mascota?.nombre ?? "Mascota"}
                                            </h2>

                                            {mascota && (
                                                <p className="mt-1 text-gray-500">
                                                    {mascota.tipo} · {mascota.edad}
                                                </p>
                                            )}

                                            <div className="mt-5">
                                                <p className="font-semibold text-gray-700">
                                                    Mensaje del adoptante:
                                                </p>

                                                <p className="mt-2 text-gray-600">
                                                    {solicitud.mensaje}
                                                </p>
                                            </div>

                                            <div className="mt-5">
                                                <span
                                                    className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${solicitud.estado ===
                                                        "Pendiente"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : solicitud.estado ===
                                                            "Aprobada"
                                                            ? "bg-green-100 text-green-700"
                                                            : solicitud.estado ===
                                                                "Rechazada"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    Estado: {solicitud.estado}
                                                </span>
                                            </div>

                                            {solicitud.estado === "Pendiente" && (
                                                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            actualizando ===
                                                            solicitud.id
                                                        }
                                                        onClick={() =>
                                                            cambiarEstado(
                                                                solicitud,
                                                                "Aprobada"
                                                            )
                                                        }
                                                        className="flex-1 rounded-full bg-green-500 px-5 py-3 font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Aprobar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            actualizando ===
                                                            solicitud.id
                                                        }
                                                        onClick={() =>
                                                            cambiarEstado(
                                                                solicitud,
                                                                "Rechazada"
                                                            )
                                                        }
                                                        className="flex-1 rounded-full bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Rechazar
                                                    </button>
                                                </div>
                                            )}

                                            {solicitud.estado === "Rechazada" && (
                                                <div className="mt-6">
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            actualizando ===
                                                            solicitud.id
                                                        }
                                                        onClick={() =>
                                                            eliminarSolicitud(
                                                                solicitud
                                                            )
                                                        }
                                                        className="w-full rounded-full bg-gray-500 px-5 py-3 font-bold text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {actualizando ===
                                                            solicitud.id
                                                            ? "Eliminando..."
                                                            : "Eliminar solicitud"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
