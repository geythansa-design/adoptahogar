"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = "/login";
}

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
    async function cerrarSesion() {
        await supabase.auth.signOut();
        window.location.href = "/login";
    }
    const [email, setEmail] = useState("");
    const [rol, setRol] = useState("");
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

            // ============================
            // OBTENER ROL DEL USUARIO
            // ============================
            const { data: perfil, error: errorPerfil } =
                await supabase
                    .from("perfiles")
                    .select("rol")
                    .eq("id", usuario.id)
                    .single();

            if (errorPerfil) {
                console.error(errorPerfil);
                setError("No se pudo cargar el perfil del usuario.");
                setCargando(false);
                return;
            }

            setRol(perfil?.rol ?? "");

            // ============================
            // OBTENER SOLICITUDES
            // ============================
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

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                Dashboard
                            </h1>

                            <p className="mt-2 text-gray-600">
                                Bienvenido a tu panel de AdoptaHogar.
                            </p>
                        </div>

                        <a
                            href="/"
                            className="rounded-full border-2 border-orange-500 px-5 py-2 text-center font-semibold text-orange-600 transition hover:bg-orange-50"
                        >
                            ← Volver al inicio
                        </a>
                    </div>

                    {cargando ? (
                        <p className="mt-6 text-gray-600">
                            Cargando información...
                        </p>
                    ) : error ? (
                        <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
                            {error}
                        </p>
                    ) : (
                        <>
                            <p className="mt-6 font-semibold text-orange-600">
                                Usuario: {email}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                {rol === "refugio" && (
                                    <a
                                        href="/dashboard/mascotas"
                                        className="rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                                    >
                                        🐾 Administrar mis mascotas
                                    </a>
                                )}

                                <button
                                    onClick={cerrarSesion}
                                    className="rounded-full border-2 border-red-500 px-6 py-3 font-bold text-red-500 transition hover:bg-red-50"
                                >
                                    Cerrar sesión
                                </button>
                            </div>

                            <p className="mt-2 text-gray-600">
                                Rol:{" "}
                                <span className="font-semibold capitalize">
                                    {rol}
                                </span>
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