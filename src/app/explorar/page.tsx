const mascotas = [
    {
        id: 1,
        nombre: "Max",
        tipo: "Perro",
        edad: "2 años",
        imagen: "/mascotas/Toby (4).png",
        descripcion: "Cariñoso, juguetón y muy amigable.",
    },
    {
        id: 2,
        nombre: "Zeus",
        tipo: "Gato",
        edad: "1 año",
        imagen: "/mascotas/Toby (2).png",
        descripcion: "Tranquila, cariñosa y muy tierna.",
    },
    {
        id: 3,
        nombre: "Rocky",
        tipo: "Perro",
        edad: "3 años",
        imagen: "/mascotas/Toby (5).png",
        descripcion: "Protector, alegre y lleno de energía.",
    },
    {
        id: 4,
        nombre: "Luna",
        tipo: "Gata",
        edad: "8 meses",
        imagen: "/mascotas/Toby (3).png",
        descripcion: "Dulce, curiosa y muy cariñosa.",
    },
    {
        id: 5,
        nombre: "Toby",
        tipo: "Perro",
        edad: "1 año",
        imagen: "/mascotas/Toby (1).png",
        descripcion: "Juguetón, obediente y lleno de alegría.",
    },
];

export default function ExplorarPage() {
    return (
        <main className="min-h-screen bg-orange-50 text-gray-800">
            {/* ENCABEZADO */}
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

            {/* TÍTULO */}
            <section className="mx-auto max-w-7xl px-6 py-16">
                <div className="mb-12 text-center">
                    <span className="font-semibold text-orange-500">
                        NUESTRAS MASCOTAS
                    </span>

                    <h2 className="mt-2 text-4xl font-extrabold text-gray-900">
                        Conoce a nuestros amigos
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Ellos están esperando encontrar una familia que les dé el amor y
                        cuidado que merecen.
                    </p>
                </div>

                {/* TARJETAS */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {mascotas.map((mascota) => (
                        <div
                            key={mascota.id}
                            className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            <div className="h-56 overflow-hidden bg-orange-100">
                                <img
                                    src={mascota.imagen}
                                    alt={`Foto de ${mascota.nombre}`}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {mascota.nombre}
                                    </h3>

                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                                        {mascota.tipo}
                                    </span>
                                </div>

                                <p className="mt-2 text-gray-600">
                                    🐾 {mascota.tipo} · {mascota.edad}
                                </p>

                                <p className="mt-3 text-sm text-gray-500">
                                    {mascota.descripcion}
                                </p>

                                <a
                                    href={`/mascotas/${mascota.id}`}
                                    className="mt-5 block w-full rounded-lg bg-orange-500 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
                                >
                                    Conocer a {mascota.nombre}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}