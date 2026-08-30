"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Mascota {
    id: number;
    nombre: string;
    tipo: string;
    edad: string;
    descripcion: string;
    imagen: string | null;
    estado: string;
}

export default function MisMascotasPage() {
    const [mascotas, setMascotas] = useState<Mascota[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarMascotas() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setError("No hay una sesión iniciada.");
                setCargando(false);
                return;
            }

            const { data: perfil, error: errorPerfil } = await supabase
                .from("perfiles")
                .select("rol")
                .eq("id", user.id)
                .single();

            if (errorPerfil) {
                console.error(errorPerfil);
                setError("No se pudo comprobar el rol del usuario.");
                setCargando(false);
                return;
            }

            if (perfil.rol !== "refugio") {
                setError("No tienes permisos para administrar mascotas.");
                setCargando(false);
                return;
            }

            const { data, error: errorMascotas } = await supabase
                .from("mascotas")
                .select(
                    "id, nombre, tipo, edad, descripcion, imagen, estado"
                )
                .eq("usuario_id", user.id)
                .order("created_at", { ascending: false });

            if (errorMascotas) {
                console.error(errorMascotas);
                setError("No se pudieron cargar las mascotas.");
                setCargando(false);
                return;
            }

            setMascotas(data ?? []);
            setCargando(false);
        }

        cargarMascotas();
    }, []);

    if (cargando) {
        return (
            <main className="min-h-screen bg-orange-50 px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <p className="text-gray-600">
                        Cargando mascotas...
                    </p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-orange-50 px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-2xl bg-white p-8 shadow-md">
                        <p className="rounded-lg bg-red-50 p-4 text-red-600">
                            {error}
                        </p>

                        <a
                            href="/dashboard"
                            className="mt-6 inline-block rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                        >
                            ← Volver al dashboard
                        </a>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-orange-50 px-6 py-12">
            <div className="mx-auto max-w-6xl">

                <div className="rounded-2xl bg-white p-8 shadow-md">

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                Mis mascotas
                            </h1>

                            <p className="mt-3 text-gray-600">
                                Mascotas publicadas por este refugio.
                            </p>
                        </div>

                        <a
                            href="/dashboard"
                            className="w-fit rounded-full border-2 border-orange-500 px-5 py-2 font-semibold text-orange-600 transition hover:bg-orange-50"
                        >
                            ← Dashboard
                        </a>
                    </div>

                    {mascotas.length === 0 ? (
                        <div className="mt-10 rounded-2xl bg-orange-50 p-8 text-center">
                            <p className="text-gray-600">
                                Todavía no has registrado mascotas.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {mascotas.map((mascota) => (
                                <div
                                    key={mascota.id}
                                    className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm"
                                >
                                    <div className="h-48 bg-orange-100">
                                        {mascota.imagen ? (
                                            <img
                                                src={mascota.imagen}
                                                alt={`Foto de ${mascota.nombre}`}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-6xl">
                                                🐾
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {mascota.nombre}
                                        </h2>

                                        <p className="mt-2 text-gray-600">
                                            {mascota.tipo} · {mascota.edad}
                                        </p>

                                        <p className="mt-3 text-sm text-gray-600">
                                            {mascota.descripcion}
                                        </p>

                                        <span className="mt-4 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                                            {mascota.estado}
                                        </span>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>
        </main>
    );
}