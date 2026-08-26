"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RestablecerPasswordPage() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    async function cambiarPassword(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setMensaje("");

        if (password !== confirmarPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setCargando(true);

        const { error } = await supabase.auth.updateUser({
            password,
        });

        if (error) {
            setError(error.message);
            setCargando(false);
            return;
        }

        setMensaje("Contraseña actualizada correctamente.");

        setTimeout(() => {
            router.push("/login");
        }, 1500);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-orange-50 px-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

                <div className="mb-8 text-center">
                    <div className="text-5xl">🔐</div>

                    <h1 className="mt-3 text-3xl font-extrabold text-orange-600">
                        Nueva contraseña
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Escribe tu nueva contraseña
                    </p>
                </div>

                <form onSubmit={cambiarPassword} className="space-y-5">

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block font-semibold text-gray-700"
                        >
                            Nueva contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmarPassword"
                            className="mb-2 block font-semibold text-gray-700"
                        >
                            Confirmar contraseña
                        </label>

                        <input
                            id="confirmarPassword"
                            type="password"
                            required
                            minLength={6}
                            value={confirmarPassword}
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                            placeholder="Repite la contraseña"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {mensaje && (
                        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                            {mensaje}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full rounded-full bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {cargando
                            ? "Actualizando..."
                            : "Cambiar contraseña"}
                    </button>

                </form>

                <div className="mt-6 text-center">
                    <a
                        href="/login"
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                    >
                        ← Volver al inicio de sesión
                    </a>
                </div>

            </div>
        </main>
    );
}