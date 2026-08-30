"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MisMascotasPage() {
    const [rol, setRol] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarPerfil() {
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
                setError("No se pudo obtener el rol del usuario.");
                setCargando(false);
                return;
            }

            setRol(perfil.rol);
            setCargando(false);
        }

        cargarPerfil();
    }, []);

    if (cargando) {
        return (
            <main className="min-h-screen bg-orange-50 px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <p className="text-gray-600">
                        Cargando información...
                    </p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-orange-50 px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <p className="rounded-lg bg-red-50 p-4 text-red-600">
                        {error}
                    </p>
                </div>
            </main>
        );
    }

    if (rol !== "refugio") {
        return (
            <main className="min-h-screen bg-orange-50 px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-2xl bg-white p-8 text-center shadow-md">
                        <div className="text-5xl">🔒</div>

                        <h1 className="mt-4 text-3xl font-bold text-gray-900">
                            Acceso restringido
                        </h1>

                        <p className="mt-3 text-gray-600">
                            Esta sección está disponible únicamente para
                            usuarios con rol de refugio.
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
                                Aquí podrás administrar las mascotas que has
                                publicado.
                            </p>
                        </div>

                        <span className="w-fit rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-700">
                            Rol: {rol}
                        </span>
                    </div>

                    <div className="mt-10 rounded-2xl border border-orange-100 bg-orange-50 p-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Gestión de mascotas 🐾
                        </h2>

                        <p className="mt-2 text-gray-600">
                            Como usuario de refugio, aquí podrás crear,
                            consultar, editar y eliminar las mascotas
                            disponibles para adopción.
                        </p>

                        <button
                            type="button"
                            className="mt-6 rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                        >
                            + Agregar mascota
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}