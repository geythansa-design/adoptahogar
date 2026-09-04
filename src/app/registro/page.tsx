"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegistroPage() {
    const router = useRouter();

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");

    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    async function registrarse(e: FormEvent<HTMLFormElement>) {
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

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nombre: nombre,
                },
            },
        });

        if (error) {
            setError(error.message);
            setCargando(false);
            return;
        }

        if (data.user) {
            setMensaje(
                "Cuenta creada correctamente. Ya puedes iniciar sesión."
            );
        }

        setCargando(false);

        setTimeout(() => {
            router.push("/login");
        }, 1500);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-orange-50 px-6 py-10">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

                <div className="mb-8 text-center">
                    <div className="text-5xl">🐾</div>

                    <h1 className="mt-3 text-3xl font-extrabold text-orange-600">
                        Crear cuenta
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Únete a AdoptaHogar
                    </p>
                </div>

                <form onSubmit={registrarse} className="space-y-5">

                    <div>
                        <label
                            htmlFor="nombre"
                            className="mb-2 block font-semibold text-gray-700"
                        >
                            Nombre completo
                        </label>

                        <input
                            id="nombre"
                            type="text"
                            required
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Tu nombre"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        />
                    </div>

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
                            value={confirmarPassword}
                            onChange={(e) =>
                                setConfirmarPassword(e.target.value)
                            }
                            placeholder="Repite tu contraseña"
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
                        {cargando ? "Creando cuenta..." : "Crear cuenta"}
                    </button>

                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <a
                        href="/login"
                        className="font-semibold text-orange-600 hover:text-orange-700"
                    >
                        Inicia sesión
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
