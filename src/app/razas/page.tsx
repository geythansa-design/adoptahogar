
"use client";

import { useEffect, useState } from "react";

interface RazasResponse {
    message: {
        [raza: string]: string[];
    };
    status: string;
}

interface Raza {
    nombre: string;
    ruta: string;
}

export default function RazasPage() {
    const [razas, setRazas] = useState<Raza[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [pagina, setPagina] = useState(1);

    const razasPorPagina = 12;

    useEffect(() => {
        async function cargarRazas() {
            try {
                const respuesta = await fetch(
                    "https://dog.ceo/api/breeds/list/all"
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudo consultar la API");
                }

                const datos: RazasResponse = await respuesta.json();

                const lista: Raza[] = [];

                Object.entries(datos.message).forEach(
                    ([razaPrincipal, subrazas]) => {

                        // Agregar raza principal
                        lista.push({
                            nombre: razaPrincipal,
                            ruta: razaPrincipal,
                        });

                        // Agregar subrazas
                        subrazas.forEach((subraza) => {
                            lista.push({
                                nombre: `${subraza} ${razaPrincipal}`,
                                ruta: `${razaPrincipal}/${subraza}`,
                            });
                        });
                    }
                );

                // Ordenar alfabéticamente
                lista.sort((a, b) =>
                    a.nombre.localeCompare(b.nombre)
                );

                setRazas(lista);

            } catch (e) {
                console.error("Error al consumir Dog API:", e);
                setError(true);
            } finally {
                setCargando(false);
            }
        }

        cargarRazas();
    }, []);

    const totalPaginas = Math.ceil(
        razas.length / razasPorPagina
    );

    const inicio = (pagina - 1) * razasPorPagina;

    const razasPagina = razas.slice(
        inicio,
        inicio + razasPorPagina
    );

    function formatearNombre(nombre: string) {
        return nombre
            .split(" ")
            .map(
                (parte) =>
                    parte.charAt(0).toUpperCase() +
                    parte.slice(1)
            )
            .join(" ");
    }

    function irAnterior() {
        setPagina((actual) => Math.max(1, actual - 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function irSiguiente() {
        setPagina((actual) =>
            Math.min(totalPaginas, actual + 1)
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <main className="min-h-screen bg-orange-50 text-gray-800">

            <nav className="bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <div className="flex items-center gap-2">
                        <span className="text-3xl">🐾</span>

                        <h1 className="text-2xl font-bold text-orange-600">
                            AdoptaHogar
                        </h1>
                    </div>

                    <a
                        href="/"
                        className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
                    >
                        ← Volver
                    </a>

                </div>
            </nav>

            <section className="mx-auto max-w-6xl px-6 py-16">

                <div className="mb-12 text-center">

                    <span className="font-semibold text-orange-500">
                        INFORMACIÓN EXTERNA
                    </span>

                    <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
                        Razas de perros
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Consulta razas y subrazas obtenidas
                        directamente desde Dog API.
                    </p>

                </div>

                {cargando && (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-md">
                        <p className="text-lg font-semibold text-gray-700">
                            Cargando razas...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-md">
                        <p className="text-lg font-semibold text-red-600">
                            No se pudo cargar la información.
                        </p>

                        <p className="mt-2 text-gray-600">
                            Intenta nuevamente más tarde.
                        </p>
                    </div>
                )}

                {!cargando && !error && (

                    <>
                        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                            {razasPagina.map((raza) => (

                                <a
                                    key={raza.ruta}
                                    href={`/razas/${raza.ruta}`}
                                    className="block rounded-2xl bg-white p-6 text-center shadow-md transition hover:-translate-y-1 hover:shadow-lg"
                                >

                                    <div className="text-4xl">
                                        🐶
                                    </div>

                                    <h3 className="mt-3 text-lg font-bold capitalize text-gray-900">
                                        {formatearNombre(raza.nombre)}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-500">
                                        Ver información de la raza →
                                    </p>

                                </a>

                            ))}

                        </div>

                        <div className="mt-10 flex flex-col items-center gap-4">

                            <p className="text-sm font-semibold text-gray-600">
                                Página {pagina} de {totalPaginas}
                            </p>

                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={irAnterior}
                                    disabled={pagina === 1}
                                    className="rounded-full bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    ← Anterior
                                </button>

                                <button
                                    type="button"
                                    onClick={irSiguiente}
                                    disabled={pagina === totalPaginas}
                                    className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Siguiente →
                                </button>

                            </div>

                        </div>
                    </>

                )}

            </section>

            <footer className="bg-gray-900 px-6 py-8 text-center text-gray-300">

                <p className="font-semibold text-white">
                    🐾 AdoptaHogar
                </p>

                <p className="mt-2 text-sm">
                    Información proporcionada por Dog API.
                </p>

            </footer>

        </main>
    );
}
