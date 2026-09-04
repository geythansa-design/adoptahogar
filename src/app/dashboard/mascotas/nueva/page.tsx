"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NuevaMascotaPage() {
    const router = useRouter();

    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("Perro");
    const [edad, setEdad] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState("");

    const [guardando, setGuardando] = useState(false);
    const [cargandoRol, setCargandoRol] = useState(true);

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        verificarRol();
    }, []);

    async function verificarRol() {
        setError("");

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            router.push("/login");
            return;
        }

        const { data: perfil, error: errorPerfil } = await supabase
            .from("perfiles")
            .select("rol")
            .eq("id", user.id)
            .single();

        if (errorPerfil || !perfil) {
            console.error(errorPerfil);
            setError("No se pudo verificar el rol del usuario.");
            setCargandoRol(false);
            return;
        }

        if (perfil.rol !== "refugio") {
            setError("No tienes permisos para registrar mascotas.");
            setCargandoRol(false);
            return;
        }

        setCargandoRol(false);
    }

    async function registrarMascota(e: React.FormEvent) {
        e.preventDefault();

        setMensaje("");
        setError("");

        if (!nombre || !edad || !descripcion) {
            setError("Completa todos los campos obligatorios.");
            return;
        }

        setGuardando(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setError("No hay una sesion iniciada.");
            setGuardando(false);
            return;
        }

        const { data: perfil, error: errorPerfil } = await supabase
            .from("perfiles")
            .select("rol")
            .eq("id", user.id)
            .single();

        if (errorPerfil || !perfil) {
            setError("No se pudo verificar el rol del usuario.");
            setGuardando(false);
            return;
        }

        if (perfil.rol !== "refugio") {
            setError("No tienes permisos para registrar mascotas.");
            setGuardando(false);
            return;
        }

        const { error: errorInsertar } = await supabase
            .from("mascotas")
            .insert({
                nombre,
                tipo,
                edad,
                descripcion,
                imagen: imagen || null,
                estado: "Disponible",
                usuario_id: user.id,
            });

        if (errorInsertar) {
            console.error(errorInsertar);
            setError("No se pudo registrar la mascota.");
            setGuardando(false);
            return;
        }

        setMensaje("Mascota registrada correctamente.");

        setNombre("");
        setTipo("Perro");
        setEdad("");
        setDescripcion("");
        setImagen("");

        setGuardando(false);
    }

    if (cargandoRol) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-orange-50">
                <p className="text-lg font-semibold text-gray-700">
                    Verificando permisos...
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-orange-50 px-6 py-12">
            <div className="mx-auto max-w-3xl">
                <div className="rounded-2xl bg-white p-8 shadow-md">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                Agregar mascota
                            </h1>

                            <p className="mt-3 text-gray-600">
                                Registra una nueva mascota para adopcion.
                            </p>
                        </div>

                        <a
                            href="/dashboard/mascotas"
                            className="w-fit rounded-full border-2 border-orange-500 px-5 py-2 font-semibold text-orange-600 transition hover:bg-orange-50"
                        >
                            ← Atras
                        </a>
                    </div>

                    {mensaje && (
                        <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
                            {mensaje}
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
                            {error}
                        </div>
                    )}

                    {!error && (
                        <form
                            onSubmit={registrarMascota}
                            className="mt-8 space-y-6"
                        >
                            <div>
                                <label className="mb-2 block font-semibold text-gray-700">
                                    Nombre *
                                </label>

                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ej. Max"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-gray-700">
                                    Tipo *
                                </label>

                                <select
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                                >
                                    <option value="Perro">Perro</option>
                                    <option value="Gato">Gato</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-gray-700">
                                    Edad *
                                </label>

                                <input
                                    type="text"
                                    value={edad}
                                    onChange={(e) => setEdad(e.target.value)}
                                    placeholder="Ej. 2 años"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-gray-700">
                                    Descripcion *
                                </label>

                                <textarea
                                    value={descripcion}
                                    onChange={(e) =>
                                        setDescripcion(e.target.value)
                                    }
                                    placeholder="Describe el caracter y las caracteristicas de la mascota."
                                    rows={5}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-gray-700">
                                    URL de imagen
                                </label>

                                <input
                                    type="text"
                                    value={imagen}
                                    onChange={(e) => setImagen(e.target.value)}
                                    placeholder="Ej. /mascotas/nueva.png"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                                />

                                <p className="mt-2 text-sm text-gray-500">
                                    Este campo es opcional.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={guardando}
                                className="w-full rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {guardando
                                    ? "Guardando..."
                                    : "Registrar mascota"}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </main>
    );
}
