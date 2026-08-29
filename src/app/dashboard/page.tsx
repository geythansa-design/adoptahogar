"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Solicitud = {
    id: number;
    mascota_id: number;
    mensaje: string;
    estado: string;
    created_at: string;
};

type Mascota = {
    id: number;
    nombre: string;
    tipo: string;
    imagen: string | null;
};

export default function DashboardPage() {
    const [email, setEmail] = useState("");
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [mascotas, setMascotas] = useState<Mascota[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarDashboard() {
            const { data, error: errorSesion } =
                await supabase.auth.getSession();

            if (errorSesion) {
                setError("No se pudo comprobar la sesión.");
                setCargando(false);
                return;
            }

            const usuario = data.session?.user;

            if (!usuario) {
                setError("No hay una sesión iniciada.");
                setCargando(false);
                return;
            }

            setEmail(usuario.email ?? "");

            const { data: solicitudesData, error: errorSolicitudes } =
                await supabase
                    .from("solicitudes_adopcion")
                    .select("*")
                    .eq("adoptante_id", usuario.id)
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
                        .select("id, nombre, tipo, imagen")
                        .in("id", idsMascotas);

                if (errorMascotas) {
                    console.error(errorMascotas);
                    setError("No se pudieron cargar las mascotas.");
                    setCargando(false);
                    return;
                }

                setMascotas(mascotasData ?? []);
            }

            setCargando(false);
        }

        cargarDashboard();
    }, []);

    function obtenerMascota(id: number) {
        return mascotas.find((mascota) => mascota.id === id);
    }

    return (
        <main className="min-h-screen bg-orange-50 px-6 py-12">
            <div className="mx-auto max-w-6xl">

                <div className="rounded-2xl bg-white p-8 shadow-md">

                    <h1 className="text-4xl font-bold text-gray-900">
                        Dashboard
                    </h1>

                    {cargando ? (
                        <p className="mt-4 text-gray-600">
                            Cargando información...
                        </p>
                    ) : error ? (
                        <p className="mt-4 rounded-lg bg-red-50 p-4 text-red-600">
                            {error}
                        </p>
                    ) : (
                        <>
                            <p className="mt-4 text-gray-600">
                                Bienvenido a tu panel de AdoptaHogar.
                            </p>

                            <p className="mt-2 font-semibold text-orange-600">
                                Usuario: {email}
                            </p>

                            <div className="mt-10">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Mis solicitudes de adopción
                                </h2>

                                {solicitudes.length === 0 ? (
                                    <p className="mt-4 text-gray-600">
                                        Todavía no tienes solicitudes de adopción.
                                    </p>
                                ) : (
                                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                                        {solicitudes.map((solicitud) => {
                                            const mascota = obtenerMascota(
                                                solicitud.mascota_id
                                            );

                                            return (
                                                <div
                                                    key={solicitud.id}
                                                    className="rounded-2xl border border-orange-100 bg-orange-50 p-6"
                                                >
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        {mascota?.nombre ??
                                                            "Mascota"}
                                                    </h3>

                                                    {mascota?.tipo && (
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {mascota.tipo}
                                                        </p>
                                                    )}

                                                    <p className="mt-4 text-gray-700">
                                                        {solicitud.mensaje}
                                                    </p>

                                                    <div className="mt-4">
                                                        <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
                                                            Estado:{" "}
                                                            {solicitud.estado}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                </div>

            </div>
        </main>
    );
}
