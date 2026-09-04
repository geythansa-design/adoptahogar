"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditarMascotaPage() {
    const router = useRouter();
    const params = useParams();

    const id = params.id as string;

    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("Perro");
    const [edad, setEdad] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState("");

    const [guardando, setGuardando] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        cargarMascota();
    }, []);

    async function cargarMascota() {
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

        if (errorPerfil || !perfil || perfil.rol !== "refugio") {
            setError("No tienes permisos para editar mascotas.");
            setCargando(false);
            return;
        }

        const { data: mascota, error: errorMascota } = await supabase
            .from("mascotas")
            .select("id, nombre, tipo, edad, descripcion, imagen")
            .eq("id", Number(id))
            .eq("usuario_id", user.id)
            .single();

        if (errorMascota || !mascota) {
            console.error(errorMascota);
            setError("No se encontró la mascota.");
            setCargando(false);
            return;
        }

        setNombre(mascota.nombre || "");
        setTipo(mascota.tipo || "Perro");
        setEdad(mascota.edad || "");
        setDescripcion(mascota.descripcion || "");
        setImagen(mascota.imagen || "");

        setCargando(false);
    }

    async function guardarCambios(e: React.FormEvent) {
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
            setError("No hay una sesión iniciada.");
            setGuardando(false);
            return;
        }

        const { error } = await supabase
            .from("mascotas")
            .update({
                nombre,
                tipo,
                edad,
                descripcion,
                imagen: imagen || null,
            })
            .eq("id", Number(id))
            .eq("usuario_id", user.id);

        if (error) {
            console.error(error);
            setError("No se pudieron guardar los cambios.");
            setGuardando(false);
            return;
        }

        setMensaje("Mascota actualizada correctamente.");
        setGuardando(false);

        setTimeout(() => {
            router.push("/dashboard/mascotas");
            router.refresh();
        }, 1000);
    }

    if (cargando) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-orange-50">
                <p className="text-lg font-semibold text-gray-700">
                    Cargando mascota...
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
                                Editar mascota
                            </h1>

                            <p className="mt-3 text-gray-600">
                                Modifica la información de la mascota.
                            </p>
                        </div>

                        <a
                            href="/dashboard/mascotas"
                            className="w-fit rounded-full border-2 border-orange-500 px-5 py-2 font-semibold text-orange-600 transition hover:bg-orange-50"
                        >
                            ← Atrás
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
                            onSubmit={guardarCambios}
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
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-gray-700">
                                    Descripción *
                                </label>

                                <textarea
                                    value={descripcion}
                                    onChange={(e) =>
                                        setDescripcion(e.target.value)
                                    }
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
                                    placeholder="Ej. https://..."
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                                />

                                <p className="mt-2 text-sm text-gray-500">
                                    Puedes agregar o cambiar la imagen.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={guardando}
                                className="w-full rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {guardando
                                    ? "Guardando..."
                                    : "Guardar cambios"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
