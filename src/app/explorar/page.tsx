import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

interface Mascota {
    id: number;
    nombre: string;
    tipo: string;
    edad: string;
    imagen: string | null;
    descripcion: string;
    estado: string;
    sexo: string;
    raza: string | null;
}

export const dynamic = "force-dynamic";

export default async function ExplorarPage({
    searchParams,
}: {
    searchParams: { tipo?: string };
}) {
    const tipoSeleccionado = searchParams.tipo;

    const { data: mascotas, error } = await supabase
        .from("mascotas")
        .select(
            "id, nombre, tipo, edad, imagen, descripcion, estado, sexo, raza"
        )
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error al cargar mascotas:", error);
    }

    const mascotasFiltradas = (mascotas ?? []).filter(
        (mascota: Mascota) => {
            if (!tipoSeleccionado) return true;

            if (tipoSeleccionado === "Gato") {
                return mascota.tipo === "Gato" || mascota.tipo === "Gata";
            }

            return mascota.tipo === tipoSeleccionado;
        }
    );

    function obtenerImagen(mascota: Mascota) {
        if (!mascota.imagen) return null;

        if (mascota.imagen.includes("/")) {
            return mascota.imagen;
        }

        const imagenes: Record<string, string> = {
            Bella: "/mascotas/Bella.png",
            Luna: "/mascotas/Luna.jpg",
            Max: "/mascotas/Max.jpg",
            Rocky: "/mascotas/Rocky.jpg",
            Toby: "/mascotas/Toby.jpg",
            Zeus: "/mascotas/Zeus.jpg",
        };

        return imagenes[mascota.nombre] ?? null;
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

            <section className="mx-auto max-w-7xl px-6 py-16">

                <div className="mb-12 text-center">

                    <span className="font-semibold text-orange-500">
                        NUESTRAS MASCOTAS
                    </span>

                    <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
                        Conoce a nuestros amigos
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Conoce a nuestras mascotas y descubre cuáles están
                        disponibles para adopción.
                    </p>

                </div>

                {mascotasFiltradas.length === 0 ? (

                    <div className="rounded-2xl bg-white p-10 text-center shadow-md">
                        <p className="text-lg text-gray-600">
                            No hay mascotas registradas en este momento.
                        </p>
                    </div>

                ) : (

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                        {mascotasFiltradas.map((mascota: Mascota) => {

                            const imagen = obtenerImagen(mascota);

                            return (
                                <div
                                    key={mascota.id}
                                    className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                                >

                                    <div className="h-56 overflow-hidden bg-orange-100">

                                        {imagen ? (

                                            <img
                                                src={imagen}
                                                alt={`Foto de ${mascota.nombre}`}
                                                className="h-full w-full object-cover"
                                            />

                                        ) : (

                                            <div className="flex h-full items-center justify-center text-6xl">
                                                🐾
                                            </div>

                                        )}

                                    </div>

                                    <div className="p-6">

                                        <h3 className="text-2xl font-bold text-gray-900 text-center">
                                            {mascota.nombre}
                                        </h3>

                                        <p className="mt-2 text-center text-gray-600">
                                            {mascota.tipo} · {mascota.edad}
                                        </p>

                                        {mascota.raza && (
                                            <p className="mt-2 text-center font-semibold text-orange-600">
                                                Raza: {mascota.raza}
                                            </p>
                                        )}

                                        <p className="mt-3 text-center text-sm text-gray-500">
                                            {mascota.descripcion}
                                        </p>

                                        <div className="mt-4 text-center">

                                            <span
                                                className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${mascota.estado === "Disponible"
                                                    ? "bg-green-100 text-green-700"
                                                    : mascota.estado === "En proceso"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-blue-100 text-blue-700"
                                                    }`}
                                            >
                                                {mascota.estado === "Adoptada" &&
                                                    mascota.sexo === "Macho"
                                                    ? "Adoptado"
                                                    : mascota.estado === "Adoptada" &&
                                                        mascota.sexo === "Hembra"
                                                        ? "Adoptada"
                                                        : mascota.estado}
                                            </span>

                                        </div>

                                        <a
                                            href={`/mascotas/${mascota.id}?tipo=${encodeURIComponent(
                                                mascota.tipo
                                            )}`}
                                            className="mt-5 block w-full rounded-lg bg-orange-500 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
                                        >
                                            Ver mascota
                                        </a>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                )}

            </section>

        </main>
    );
}