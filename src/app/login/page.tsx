"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirect = searchParams.get("redirect");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    async function iniciarSesion(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setCargando(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            setError("Correo o contraseña incorrectos.");
            setCargando(false);
            return;
        }

        const { data: perfil, error: errorPerfil } = await supabase
            .from("perfiles")
            .select("rol")
            .eq("id", data.user.id)
            .single();

        if (errorPerfil || !perfil) {
            setError("No se pudo identificar el tipo de usuario.");
            setCargando(false);
            return;
        }

        if (redirect && perfil.rol === "adoptante") {
            router.push(redirect);
            router.refresh();
            return;
        }

        if (perfil.rol === "refugio") {
            router.push("/dashboard");
            router.refresh();
            return;
        }

        if (perfil.rol === "adoptante") {
            router.push("/explorar");
            router.refresh();
            return;
        }

        setError("El rol de usuario no es válido.");
        setCargando(false);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-orange-50 px-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

                <div className="mb-8 text-center">
                    <div className="text-5xl">🐾</div>

                    <h1 className="mt-3 text-3xl font-extrabold text-orange-600">
                        AdoptaHogar
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Inicia sesión para continuar
                    </p>
                </div>

                <form onSubmit={iniciarSesion} className="space-y-5">

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block font-semibold text-gray-700"
                        >
                            Correo electrónico
                        </label>

                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo@ejemplo.com"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block font-semibold text-gray-700"
                        >
                            Contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full rounded-full bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {cargando
                            ? "Iniciando sesión..."
                            : "Iniciar sesión"}
                    </button>

                </form>

                <div className="mt-4 text-center">
                    <a
                        href="/recuperar-password"
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                    >
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    ¿No tienes una cuenta?{" "}
                    <a
                        href="/registro"
                        className="font-semibold text-orange-600 hover:text-orange-700"
                    >
                        Regístrate
                    </a>
                </div>

                <div className="mt-4 text-center">
                    <a
                        href="/"
                        className="text-sm text-gray-500 hover:text-orange-600"
                    >
                        ← Volver al inicio
                    </a>
                </div>

            </div>
        </main>
    );
}
