"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Perfil = {
    rol: string;
};

export default function DashboardPage() {
    const [email, setEmail] = useState("");
    const [rol, setRol] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    async function cerrarSesion() {
        await supabase.auth.signOut();
        window.location.href = "/login";
    }

    useEffect(() => {
        async function cargarDashboard() {
            const {
                data: { user },
                error: errorUsuario,
            } = await supabase.auth.getUser();

            if (errorUsuario || !user) {
                setError("No hay una sesión iniciada.");
                setCargando(false);
                return;
            }

            setEmail(user.email ?? "");

            const { data: perfil, error: errorPerfil } = await supabase
                .from("perfiles")
                .select("rol")
                .eq("id", user.id)
                .single();

            if (errorPerfil) {
                console.error(errorPerfil);
                setError("No se pudo cargar el perfil del usuario.");
                setCargando(false);
                return;
            }

            setRol((perfil as Perfil)?.rol ?? "");
            setCargando(false);
        }

        cargarDashboard();
    }, []);

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

                            <p className="mt-2 text-gray-600">
                                Rol:{" "}
                                <span className="font-semibold capitalize">
                                    {rol}
                                </span>
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">

                                {rol === "refugio" && (
                                    <>
                                        <a
                                            href="/dashboard/mascotas"
                                            className="rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                                        >
                                            🐾 Administrar mis mascotas
                                        </a>

                                        <a
                                            href="/dashboard/solicitudes"
                                            className="rounded-full bg-blue-500 px-6 py-3 font-bold text-white transition hover:bg-blue-600"
                                        >
                                            📋 Ver solicitudes de adopción
                                        </a>
                                    </>
                                )}

                                <button
                                    onClick={cerrarSesion}
                                    className="rounded-full border-2 border-red-500 px-6 py-3 font-bold text-red-500 transition hover:bg-red-50"
                                >
                                    Cerrar sesión
                                </button>

                            </div>

                        </>
                    )}

                </div>
            </div>
        </main>
    );

}
