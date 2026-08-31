
"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SolicitudPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const mascotaId = searchParams.get("mascota");
    const mascotaNombre = searchParams.get("nombre");

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    async function enviarSolicitud(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setMensaje("");
        setError("");
        setCargando(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setError("Debes iniciar sesión para enviar una solicitud.");
            setCargando(false);
            return;
        }

        if (!mascotaId) {
            setError("No se encontró la mascota seleccionada.");
            setCargando(false);
            return;
        }

        if (!mensaje.trim()) {
            setError("Por favor, escribe un mensaje para el refugio.");
            setCargando(false);
            return;
        }

        // Verificar si el usuario ya tiene una solicitud para esta mascota
        const { data: solicitudExistente, error: errorConsulta } =
            await supabase
                .from("solicitudes_adopcion")
                .select("id, estado")
                .eq("mascota_id", Number(mascotaId))
                .eq("adoptante_id", user.id)
                .in("estado", ["Pendiente", "Aprobada"])
                .maybeSingle();

        if (errorConsulta) {
            console.error(errorConsulta);
            setError(
                "No se pudo comprobar si ya existe una solicitud para esta mascota."
            );
            setCargando(false);
            return;
        }

        if (solicitudExistente) {
            if (solicitudExistente.estado === "Aprobada") {
                setError(
                    `Ya tienes una solicitud aprobada para ${mascotaNombre || "esta mascota"}.`
                );
            } else {
                setError(
                    `Ya tienes una solicitud para ${mascotaNombre || "esta mascota"} en trámite. No puedes enviar otra solicitud mientras la anterior esté pendiente.`
                );
            }

            setCargando(false);
            return;
        }

        // Crear nueva solicitud
        const { error: errorInsercion } = await supabase
            .from("solicitudes_adopcion")
            .insert({
                mascota_id: Number(mascotaId),
                adoptante_id: user.id,
                mensaje: mensaje.trim(),
                estado: "Pendiente",
            });

        if (errorInsercion) {
            console.error(errorInsercion);
            setError("No se pudo enviar la solicitud. Inténtalo nuevamente.");
            setCargando(false);
            return;
        }

        setMensaje("¡Solicitud enviada correctamente!");

        setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
        }, 1500);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-orange-50 px-6 py-10">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">

                <div className="mb-8 text-center">
                    <div className="text-5xl">🐾</div>

                    <h1 className="mt-3 text-3xl font-extrabold text-orange-600">
                        Solicitud de adopción
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Estás iniciando el proceso para adoptar:
                    </p>

                    <p className="mt-3 text-xl font-bold text-gray-800">
                        🐾 {mascotaNombre || "Mascota seleccionada"}
                    </p>
                </div>

                <form onSubmit={enviarSolicitud}>

                    <div>
                        <label
                            htmlFor="mensaje"
                            className="mb-2 block font-semibold text-gray-700"
                        >
                            ¿Por qué quieres adoptar a esta mascota?
                        </label>

                        <textarea
                            id="mensaje"
                            required
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            placeholder="Escribe un mensaje para el refugio..."
                            rows={5}
                            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        />
                    </div>

                    <div className="mt-5 rounded-xl bg-orange-50 p-5">
                        <p className="font-semibold text-gray-700">
                            Estado inicial de la solicitud
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                            Tu solicitud será enviada como{" "}
                            <strong>Pendiente</strong> para que pueda ser revisada.
                        </p>
                    </div>

                    {error && (
                        <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {mensaje === "¡Solicitud enviada correctamente!" && (
                        <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                            {mensaje}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={cargando}
                        className="mt-6 w-full rounded-full bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {cargando
                            ? "Enviando solicitud..."
                            : "Enviar solicitud 🐾"}
                    </button>

                </form>

                <div className="mt-5 text-center">
                    <a
                        href="/explorar"
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                    >
                        ← Volver a mascotas
                    </a>
                </div>

            </div>
        </main>
    );
}
